<?php
 header('Content-Type: application/json'); // Đặt tiêu đề phản hồi là JSON
 include '../../config/connect.php'; // Kết nối cơ sở dữ liệu

// Lấy dữ liệu JSON từ request body
 $data = json_decode(file_get_contents("php://input"), true);
 $readerID = $data['readerID']; 
 $bookID = $data['bookID']; 

 date_default_timezone_set('Asia/Ho_Chi_Minh'); // Đặt múi giờ Việt Nam

 $borrow_date = date("Y-m-d H:i:s"); // Lấy ngày giờ hiện tại
 $due_date = date("Y-m-d H:i:s", strtotime("+14 days")); // Tính toán ngày hết hạn (7 ngày sau ngày mượn)
 
 

?>