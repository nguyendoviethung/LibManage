<?php

function checkAdminRole($decode) {
    if (!isset($decode->data->role) || $decode->data->role !== 'admin') {
        http_response_code(403);
        echo json_encode(["status" => false, "error" => "Bạn không có quyền truy cập"]);
        exit();
    }
}

function checkReaderRole($decode) {
    if (!isset($decode->data->role) || $decode->data->role !== 'student') {
        http_response_code(403);
        echo json_encode(["status" => false, "error" => "Bạn không có quyền truy cập"]);
        exit();
    }
}

?>