    <?php
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header('Content-Type: application/json'); // Đặt tiêu đề cho phản hồi là JSON

    include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu
    // Lấy dữ liệu JSON từ body của request
    $data = json_decode(file_get_contents("php://input"), true);
    $title = $data['title'];
    $author = $data['author_name'];
    $language = $data['lang'];
    $year = $data['publisher_year'];
    $location = $data['location'];
    $genre = $data['genre'];
    $quantity = $data['quantity'];
    // Kiểm tra dữ liệu hợp lệ
    if (isset($title) && isset($author) && isset($language) && isset($year) && isset($location) && isset($genre) && isset($quantity)) {

        // Kiểm tra kết nối CSDL (Nếu chưa kết nối thì dừng)
        if (!$conn) {
            die("Kết nối thất bại: " . pg_last_error());
        }
        // Truy vấn để thêm sách vào cơ sở dữ liệu
        $query = "INSERT INTO books (title, author_name, lang, publisher_year, location, genre, quantity) 
                  VALUES ($1, $2, $3, $4, $5, $6, $7)";

        $result = pg_query_params($conn, $query, [
        $title,$author,$language,$year,$location,$genre,$quantity
                                    ]);

        // Kiểm tra kết quả
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Sách đã được thêm']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Lỗi khi thêm sách: ' . pg_last_error()]);
        }

        // Đóng kết nối
        pg_close($conn);
    } else {
        echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ']);
    }

    ?>
