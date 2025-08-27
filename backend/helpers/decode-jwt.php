<?php
require __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function decode_jwt($jwt) {
    $config = require __DIR__ . '/../config/jwt-config.php';
    return JWT::decode($jwt, new Key($config['key'], 'HS256'));
}
