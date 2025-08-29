<?php
require __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;   
use Firebase\JWT\Key;

function verify_jwt($jwt) {
    $config = require __DIR__ . '/../config/jwt-config.php';
    $key = $config['key'];

    try {
        $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
        return $decoded; 
    } catch (\Firebase\JWT\ExpiredException $e) {
        http_response_code(401);
        echo json_encode(["status" => false, "error" => "Token has expired"]);
        exit();
    } catch (\Firebase\JWT\SignatureInvalidException $e) {
        http_response_code(401);
        echo json_encode(["status" => false, "error" => "Invalid Token"]);
        exit();
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["status" => false, "error" => "Error while decoding token"]);
        exit();
    }
}
