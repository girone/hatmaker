
<?php
include("database.php");

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

function PHP_to_JSON($rows)
{
    return json_encode($rows, JSON_NUMERIC_CHECK);
}

function JSON_to_PHP($json)
{
    return json_decode($json, $assoc = true);
}

function store_player_data($player_data)
{
    $con = create_connection();

    // Ensure the player exists.
    $query = "SELECT COUNT(*) FROM MischMasch WHERE `index`=" . $player_data["player_index"];
    print $query . "\n";
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

    $writeFields = new \Ds\Set();
    $writeFields->add("player_index");
    $writeFields->add("status");
    $writeFields->add("confirmation_date");
    $writeFields->add("reimburse_date");
    $writeFields->add("notes");
    $writeFields->add("last_change");
    $writeFields->add("last_author");

    // $query = "SELECT COUNT(*) FROM payments WHERE `player_index`=" . $player_data["player_index"];
    // print $query . "\n";
    // $sth = $con->query($query);
    // if (!$sth) {
    //     echo mysqli_error($con);
    //     die();
    // }
    // $rows = $sth->fetch_all();
    // $count = $rows[0][0];
    // if ($count != 1) {
    //     echo "Player does not yet exist in payments table, creating initial entry.\n";
    //     $query = "INSERT INTO `payments`(`player_index`, `status`, `last_change`) VALUES (" . $player_data["player_index"] . ", 'not paid', CURDATE())";
    //     print $query . "\n";
    //     $sth = $con->query($query);
    //     if (!$sth) {
    //         echo mysqli_error($con);
    //         die();
    //     }
    // }

    $query = "REPLACE INTO payments SET ";
    $numFields = 0;
    // print_r($player_data);
    // print "\n";
    foreach ($player_data as $key => $value) {
        if ($writeFields->contains($key) and $value) {
            if ($numFields > 0) {
                $query .= ", ";
            }
            $query = $query . $con->real_escape_string($key) . "='" . $con->real_escape_string($value) . "'";
            $numFields++;
        }
    }
    print $query . "\n";
    $sth = $con->query($query);
    if (!$sth) {
        echo mysqli_error($con);
        die();
    }
    print "Updated player " . $player_data["name"];
}

// Authenthication.
include("payment_users.php");  // loads $USERS
if (!(isset($_GET["user"]) and !isset($_GET["pass"])) and
    $USERS[$_GET["user"]] !== $_GET["pass"]) {
    print "Not authenticated.";
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
