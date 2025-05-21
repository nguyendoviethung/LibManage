<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu
include '../../helpers/validation.php'; // Bao gồm các hàm kiểm tra định dang email, phoneNumber, studentID, faculty,username,password
if (!$conn) {
    echo json_encode(["error" => "Không thể kết nối cơ sở dữ liệu."]);
    exit;
}

// Đọc dữ liệu JSON từ client
$data = json_decode(file_get_contents('php://input'), true);
$name = $data['full_name'] ?? ''; //Gán biến $name bằng $data['name'] nếu có, nếu không có (không tồn tại hoặc null) thì gán bằng chuỗi rỗng ''.
$studentID = $data['student_id'] ?? ''; //Gán biến $studentID bằng $data['studentID'] nếu có, nếu không có (không tồn tại hoặc null) thì gán bằng chuỗi rỗng ''.
$email = $data['email'] ?? ''; //Gán biến $email bằng $data['email'] nếu có, nếu không có (không tồn tại hoặc null) thì gán bằng chuỗi rỗng ''.
$phoneNumber= $data['phone_number'] ?? ''; //Gán biến $phone bằng $data['phone'] nếu có, nếu không có (không tồn tại hoặc null) thì gán bằng chuỗi rỗng ''.
$faculty = $data['faculty'] ?? ''; //Gán biến $faculty bằng $data['faculty'] nếu có, nếu không có (không tồn tại hoặc null) thì gán bằng chuỗi rỗng ''.

if(isValidStudentID($studentID)==false){
    echo json_encode(['success' => false, 'message' => 'Mã số sinh viên không hợp lệ.']);
    exit;
}
else if (isValidSchoolEmail($email,$name,$studentID)==false){
    echo json_encode(['success' => false, 'message' => 'Email không hợp lệ.']);
    exit;
}
else if(isValidPhoneNumber($phoneNumber)==false){
    echo json_encode(['success' => false, 'message' => 'Số điện thoại không hợp lệ.']);
    exit;   
}
else if(isValidFaculty($faculty)==false){
    echo json_encode(['success' => false, 'message' => 'Tên khoa không hợp lệ.']);
    exit;
}
else {
     
    //1.Kiểm tra xem mã số sinh viên đã tồn tại trong cơ sở dữ liệu chưa
    $checkQuery = "SELECT 1 FROM reader WHERE student_id = $1";
    $checkResult = pg_query_params($conn, $checkQuery, [$studentID]);
    
    // Đếm số dòng kết quả trong một truy vấn SELECT(ở đây là kiểm tra xem sinh viên đã tồn tại hay chưa)
    // Nếu có dòng nào trả về thì đã tồn tại
    if (pg_num_rows($checkResult) > 0) {
        echo json_encode(['success' => false, 'message' => 'Mã số sinh viên này đã tồn tại']);
        exit();
    }   
    
// 2. Kiểm tra số điện thoại đã tồn tại chưa (trước khi INSERT)
$checkPhoneQuery = "SELECT 1 FROM reader WHERE phone_number = $1";
$checkPhoneResult = pg_query_params($conn, $checkPhoneQuery, [$phoneNumber]);

if( pg_num_rows($checkPhoneResult) > 0) {
    echo json_encode(['success' => false, 'message' => '❗ Số điện thoại này đã được sử dụng.']);
    exit;
}
    // Nếu qua các kiểm tra truy vấn trên thì thêm sinh viên mới vào cơ sở dữ liệu
    $query = "INSERT INTO reader (student_id, full_name, email, phone_number, faculty) 
              VALUES ($1, $2, $3, $4, $5)";

$result = pg_query_params($conn, $query, [
  $studentID,
  $name,
  $email,
  $phoneNumber,
  $faculty
]);


    // Kiểm tra kết quả
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Thêm thành công']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Có lỗi: ' . pg_last_error()]);
    }
    
    // Đóng kết nối
    pg_close($conn);
}
?>
