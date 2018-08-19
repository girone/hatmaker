
<?php
include("../database.php");

error_reporting(E_ALL);

function fetch_all_data()
{
    $con = create_connection();
    $sth = $con->query("SELECT * FROM MischMasch AS t1 LEFT JOIN payments AS t2 ON t1.index=t2.player_index ORDER BY `index`");
    if (!$sth) {
        echo mysqli_error($con);
        die();
    }
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $r["player_index"] = $r["index"];
        if (!isset($r["status"])) {
            $r["status"] ="not paid";
        }
        $rows[] = $r;
    }
    return $rows;
}

// Const array modelling a set in PHP7.x. Note that the values of 1 are necessary to make isset() work.
define('WRITE_FIELDS', array(
    "player_index" => 1,
    "status" => 1,
    "confirmation_date" => 1,
    "reimburse_date" => 1,
    "notes" => 1,
    "last_change" => 1,
    "last_author" => 1,
));

function store_player_data($player_data)
{
    $con = create_connection();

    // Ensure the player exists.
    $query = "SELECT COUNT(*) FROM MischMasch WHERE `index`=" . $player_data["player_index"];
    // print $query . "\n";
    $sth = $con->query($query);
    if (!$sth) {
        echo mysqli_error($con);
        die();
    }
    $rows = $sth->fetch_all();
    $count = $rows[0][0];
    if ($count != 1) {
        echo "Player does not exist! " . $player_data["player_index"] . "\n";
        die();
    } else {
        echo "Player exists: " . $player_data["player_index"] . " " . $player_data["name"] . "\n";
    }

    $query = "REPLACE INTO payments SET ";
    $numFields = 0;
    foreach ($player_data as $key => $value) {
        if (isset(WRITE_FIELDS[$key]) and $value) {
            if ($numFields > 0) {
                $query .= ", ";
            }
            $query = $query . $con->real_escape_string($key) . "='" . $con->real_escape_string($value) . "'";
            $numFields++;
        }
    }
    // print $query . "\n";
    $sth = $con->query($query);
    if (!$sth) {
        echo mysqli_error($con);
        die();
    }
    print "Updated player " . $player_data["name"];
    // TODO(Jonas): Send back JSON as acknowledgement.
}

// Authenthication. TODO(Jonas): Add existance check for the file.
include("../users.php");  // loads $USERS
if (!(isset($_GET["user"]) and !isset($_GET["pass"])) and
    $USERS[$_GET["user"]] !== $_GET["pass"]) {
    print "{ \"error\": \"Not authenticated.\" }";
    return;
}

if (isset($_GET["action"])) {
    if ($_GET["action"] === "store") {
        $data = JSON_to_PHP($_POST["entry"]);
        store_player_data($data);
    }
    if ($_GET["action"] === "fetchAll") {
        $data = fetch_all_data();
        print PHP_to_JSON($data);
    }
}

?>
