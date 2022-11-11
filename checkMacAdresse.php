<?php
include "../private/redis.inc.php";

ini_set('display_errors', 1); 
error_reporting(E_ALL);

$maca = $_GET["maca"];
$maca = strtoupper($maca);

$redishost = "localhost";
$redisport = "6379";

$redis = new Redis(); 
$redis->pconnect($redishost, $redisport); 
$redis->auth($redispassword);

$spielerliste = $redis->lRange("spielerliste", 0, -1);
foreach ($spielerliste as $value) {
    $macAdresse = explode('-', $value)[1];
    $name = explode('-', $value)[0];
   # echo "mAdresse: ".$macAdresse."\n";
   # echo "name: ". $name. "\n";

    if ($maca == $macAdresse) {
        echo $name;
    }
}

$redis->close();

?>