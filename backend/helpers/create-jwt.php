<?php
require __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;

function create_jwt($userId, $username , $role) {
    $config = require __DIR__ . '/../config/jwt-config.php';

    $payload = [
        "iss" => $config['issuer'],
        "aud" => $config['audience'],
        "iat" => time(),
        "exp" => time() + $config['expire_time'],
        "data" => [
            'id' => $userId,
            'username' => $username,
            'role' => $role,
        ]
    ];

    return JWT::encode($payload, $config['key'], 'HS256');
}
