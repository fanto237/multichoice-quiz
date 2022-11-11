
<?php
include "../private/redis.inc.php";

ini_set('display_errors', 1); 
error_reporting(E_ALL);
$redishost = "localhost";
$redisport = "6379";

$redis = new Redis(); 
$redis->pconnect($redishost, $redisport); 
$redis->auth($redispassword);

$name = $_GET["name"];
$maca = $_GET["maca"];

$maca = strtoupper($maca);

$username = $name."-".$maca;
//echo "username: ".$username;

//vorhandene Spieler finden
$spielerliste = $redis->lRange("spielerliste", 0, -1);
foreach ($spielerliste as $value) {
    echo $value.";";
}

// für neue Clients
$redis->lPush("spielerliste", $username);
// für Clients die schon in der Lobby sind
$redis->publish("spielerliste", $username);
$redis->close();

?>
