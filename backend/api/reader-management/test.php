<?php
require __DIR__ . '/../../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;

$mail = new PHPMailer(true);
$mail->isSMTP();
$mail->Host = 'localhost';
$mail->Port = 1025;
$mail->SMTPAuth = false;

$mail->setFrom('admin@libmanage.com', 'Library Test');
$mail->addAddress('test@example.com', 'Test User');
$mail->Subject = 'Test Mail';
$mail->Body = 'Đây là mail test MailHog';
$mail->send();

echo "Mail đã gửi xong!";
