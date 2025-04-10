<?php
// 1.Hàm kiểm tra định dạng mã số sinh viên
function isValidStudentID($studentID) {
    if (!preg_match('/^\d{8}$/', $studentID)) return false;

    $year = substr($studentID, 0, 4);
    $sequence = substr($studentID, 4, 4);

    // Kiểm tra năm hợp lệ (ví dụ từ 2010 đến năm hiện tại + 1)
    $currentYear = date("Y") + 1;
    if ((int)$year < 2010 || (int)$year > $currentYear) return false;

    // Số thứ tự phải >= 0001 và <= 9999
    if ((int)$sequence < 1 || (int)$sequence > 9999) return false;

    return true;
}
// 2.Phần kiểm tra định dạng email
// Hàm phụ để loại bỏ dấu tiếng Việt:
    function normalizeVietnameseString($str) {
        $str = mb_strtolower($str, 'UTF-8'); // chuyển về thường

        // Loại bỏ dấu tiếng Việt
        // str_replace(array|string $search, array|string $replace, string $subject): string 
        // --> Chuỗi mới được trả về sau khi thay thế tất cả các giá trị tìm thấy trong chuỗi subject bằng các giá trị tương ứng trong mảng replace.
        // Nếu không tìm thấy giá trị nào trong mảng search thì trả về chuỗi subject ban đầu.
        $str = str_replace(
            ['à','á','ạ','ả','ã','â','ầ','ấ','ậ','ẩ','ẫ','ă','ằ','ắ','ặ','ẳ','ẵ',
            'è','é','ẹ','ẻ','ẽ','ê','ề','ế','ệ','ể','ễ',
            'ì','í','ị','ỉ','ĩ',
            'ò','ó','ọ','ỏ','õ','ô','ồ','ố','ộ','ổ','ỗ','ơ','ờ','ớ','ợ','ở','ỡ',
            'ù','ú','ụ','ủ','ũ','ư','ừ','ứ','ự','ử','ữ',
            'ỳ','ý','ỵ','ỷ','ỹ',
            'đ'],
            ['a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a','a',
            'e','e','e','e','e','e','e','e','e','e','e',
            'i','i','i','i','i',
            'o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o',
            'u','u','u','u','u','u','u','u','u','u','u',
            'y','y','y','y','y',
            'd'],
            $str
        );

        return $str; // Trả về chuỗi đã chuẩn hóa
    }

    //Hàm kiểm tra định dạng email
    function isValidSchoolEmail($email, $fullName, $studentID) {
        // B1: Chuẩn hóa tên - bỏ dấu, viết liền, thường hóa
        $normalizedFullName = normalizeVietnameseString($fullName); // Tên không dấu
        // str_replace(' ', '', $normalizedFullName) --> loại bỏ khoảng trắng trong tên
        $expectedPrefix = strtolower(str_replace(' ', '', $normalizedFullName)) . $studentID; // Nối với mã sinh viên
        $expectedEmail = $expectedPrefix . '@stu.gcut.edu.vn'; // Địa chỉ email mong đợi

        return filter_var($email, FILTER_VALIDATE_EMAIL) && $email === $expectedEmail;
    }

//3. Hàm kiểm tra định dạng số điện thoại

function isValidPhoneNumber($phone) {
    // Loại bỏ khoảng trắng, dấu - hoặc dấu .
    $phone = preg_replace('/[\s\-.]/', '', $phone);

    // Kiểm tra bắt đầu bằng 0 hoặc +84, theo sau là 9–10 chữ số
    return preg_match('/^(0|\+84)[0-9]{9}$/', $phone);
}

// 4.Hàm kiểm tra định dạng tên khoa 

function isValidFaculty($facultyName) {
    $validFaculties = [
        'Khoa Học Máy Tính',
        'Tự Động Hóa & Điện Tử',
        'Công Nghệ Thông Tin Toàn Cầu',
        'Kỹ Thuật Phần Mềm',
        'Quản Trị Công Nghệ',
        'Thiết Kế & Truyền Thông Số',
        'Khoa Học Dữ Liệu & AI',
        'Ngoại Ngữ & Giao Tiếp',
        'Công Nghệ Sinh Học & Kỹ Thuật Y Sinh'
    ];

    // Chỉ kiểm tra xem chuỗi nhập vào có nằm trong danh sách không (phân biệt hoa thường)
    return in_array($facultyName, $validFaculties);
}

// 5.Hàm kiểm tra định dạng mật khẩu
function isValidPassword($password) {
    // Kiểm tra độ dài
    if (strlen($password) < 8) {
        return false;
    }
    //  preg_match() dùng để kiểm tra một chuỗi có khớp với biểu thức chính quy (regex) hay không.
    // Nếu không khớp thì trả về false, nếu khớp thì trả về true.
    // Kiểm tra khoảng trắng
    if (preg_match('/\s/', $password)) {
        return false;
    }

    // Kiểm tra có chữ thường hay không
    if (!preg_match('/[a-z]/', $password)) {
        return false;
    }

    // Kiểm tra có chữ in hoa hay không
    if (!preg_match('/[A-Z]/', $password)) {
        return false;
    }

    // Kiểm tra có số hay không
    if (!preg_match('/[0-9]/', $password)) {
        return false;
    }

    // Kiểm tra có ký tự đặc biệt hay không
    if (!preg_match('/[\W_]/', $password)) {
        return false;
    }
    
    //Kiểm tra có viết có dấu hay không
    if (preg_match('/[^\x00-\x7F]/', $password)) {
        return false;
    }
   
    // Nếu qua tất cả kiểm tra → hợp lệ
    return true;
}   
function isValidUserName($username) {
    // Kiểm tra độ dài tối thiểu 8 ký tự
    if (strlen($username) < 8) {
        return false;
    }
    // Kiểm tra có ký tự hợp lệ hay không  (chỉ cho phép chữ cái, số và dấu gạch dưới)
    if (!preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
        return false;
    }
    // Dấu "+" là có Ít nhất 1 ký tự khớp(nhưng trên kiểm tra đã có rồi)
    // Nếu qua tất cả kiểm tra → hợp lệ
    return true;
}
?>

