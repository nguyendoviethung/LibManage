<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu
include '../../helpers/validation.php'; // Bao gồm các hàm kiểm tra định dang email, phoneNumber, studentID, faculty,username,password
if (!$conn) {
    echo json_encode(["success" => false, "message" => "Không thể kết nối cơ sở dữ liệu."]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
// Lấy dữ liệu từ client
$studentID = $data['student_id'];
$newName = $data['full_name'] ;
$newEmail = $data['email'];
$newPhone = $data['phone_number'];
$newFaculty = $data['faculty'];
$newStatus = $data['status'];
$valueCheckBox = $data['keepAccountStatus']; 

// I.Kiểm tra sự tồn tại của MSSV, Email, SĐT trong cơ sở dữ liệu

// 2. Kiểm tra SĐT đã tồn tại ở sinh viên khác chưa và thuộc về sinh viên đang học(active)
$queryPhone = "SELECT 1 FROM reader WHERE phone_number = $1 AND student_id != $2";
$resPhone = pg_query_params($conn, $queryPhone, [$newPhone, $studentID]);
if (pg_num_rows($resPhone) > 0) {
    echo json_encode(['success' => false, 'message' => '❗Số điện thoại đã tồn tại.']);
    pg_close($conn);
    exit;
}

// II.Kiểm tra định dạng của các trường dữ liệu

// 1. Kiểm tra định dạng mã số sinh viên
if (!isValidStudentID($studentID)) {
    echo json_encode(['success' => false, 'message' => '❗Mã số sinh viên không hợp lệ.']);
    pg_close($conn);
    exit;
}

// 2.Kiểm tra định dạng email
if (!isValidSchoolEmail($newEmail, $newName, $studentID)) {
    echo json_encode(['success' => false, 'message' => '❗Email không hợp lệ.']);
    pg_close($conn);
    exit;
}

// 3.Kiểm tra định dạng số điện thoại
if (!isValidPhoneNumber($newPhone)) {
    echo json_encode(['success' => false, 'message' => '❗Số điện thoại không hợp lệ.']);
    pg_close($conn);
    exit;
}

// 4.Kiểm tra định dạng khoa
if (!isValidFaculty($newFaculty)) {
    echo json_encode(['success' => false, 'message' => '❗Khoa không hợp lệ.']);
    pg_close($conn);
    exit;
}

//  III. Nếu mọi thứ OK → Cập nhật

// 1.Cập nhật thông tin sinh viên trong cơ sở dữ liệu

    $query = "UPDATE reader 
          SET full_name = $1, email = $2, phone_number = $3, faculty = $4, status = $5
          WHERE student_id = $6";
    $updateResult = pg_query_params($conn, $query, [
    $newName, $newEmail, $newPhone, $newFaculty, $newStatus, $studentID]);

//  2.Cập nhật đồng thời status của tài khoản người dùng

    $updateStatusResult = true; // mặc định là true nếu không xử lý gì
    if ($valueCheckBox == true) {
    if($newStatus == 'Inactive') {
        $queryStatus = "UPDATE readeraccounts SET status = $1 WHERE student_id = $2";
        $updateStatusResult = pg_query_params($conn, $queryStatus, ['Disabled', $studentID]);
    } else if ($newStatus == 'Banned'){
        $queryStatus = "UPDATE readeraccounts SET status = $1 WHERE student_id = $2";
        $updateStatusResult = pg_query_params($conn, $queryStatus, ['Banned', $studentID]);
    }else if ($newStatus == 'Active') {
        $queryStatus = "UPDATE readeraccounts SET status = $1 WHERE student_id = $2";
        $updateStatusResult = pg_query_params($conn, $queryStatus, ['Active', $studentID]);
    }
 }

// IV. Kiểm tra kết quả cập nhật

    if ($updateResult == true && $updateStatusResult == true) {
    // Nếu cập nhật thành công, trả về thông báo thành công
    echo json_encode(['success' => true, 'message' => '✅ Cập nhật thông tin sinh viên thành công.']);
}    else {
    echo json_encode(['success' => false, 'message' => '❌ Cập nhật thất bại: ' . pg_last_error()]);
}

// Đóng kết nối cơ sở dữ liệu
    pg_close($conn);
?>
