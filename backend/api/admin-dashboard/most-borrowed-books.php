<?php
// Kết nối đến cơ sở dữ liệu
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu

// Lấy số lượng cuốn sách trong thư viện
$query = "SELECT 
        b.title ,
        b.author_name ,
    COUNT(br.book_id) AS times
    FROM 
        borrowrecords br
    JOIN 
        books b ON br.book_id = b.book_id
    GROUP BY 
        br.book_id, b.title, b.author_name
    ORDER BY 
        times DESC
    LIMIT 5;";
          
$result = pg_query($conn, $query);
$books = pg_fetch_all($result);

if ($books === false) {
    echo json_encode(['error' => 'Không có sách được mượn']);
} else {
    echo json_encode($books); // Trả về mảng các object
}

pg_close($conn);
?>