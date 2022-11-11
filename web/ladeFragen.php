<?php
ini_set('display_errors', 1); 
error_reporting(E_ALL);

$curl_session = curl_init(); 
curl_setopt($curl_session ,CURLOPT_URL,"https://quizapi.io/api/v1/questions?apiKey=ALL03TYO0rTyM0YS1wNNova2ATPPEbRXFQKnsHMR&limit=1");
curl_setopt($curl_session, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($curl_session );
curl_close($curl_session );

$file = 'fragen.json';
file_put_contents($file, $result);

?>
