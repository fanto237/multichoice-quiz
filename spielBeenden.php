<?php
include "../private/redis.inc.php";

ini_set('display_errors', 1); 
error_reporting(E_ALL);
$redishost = "localhost";
$redisport = "6379";

$redis = new Redis(); 
$redis->pconnect($redishost, $redisport); 
$redis->auth($redispassword);

$redis->flushAll();

$redis->close();

?>