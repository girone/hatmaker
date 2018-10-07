<?php
// include("../database.php");
include("../json.php");

error_reporting(E_ALL);

function fetch_all_data_from_database($obfuscate)
{
    $con = create_connection();
    $query = "SELECT * FROM MischMasch AS t1 LEFT JOIN team_assignment AS t2 ON t1.index=t2.player_index WHERE t1.deleted IS NULL ORDER BY `index`";
    $sth = $con->query($query);
    if (!$sth) {
        echo mysqli_error($con);
        die();
    }
    $rows = array();
    while ($r = mysqli_fetch_assoc($sth)) {
        $r["player_index"] = $r["index"];
        if (!isset($r["team"])) {
            $r["team"] = 0;
        }
        if (!isset($r["team_position"])) {
            $r["team_position"] = 0;
        }
        if ($obfuscate) {
            $r["name"] = obfuscate_name($r["name"]);
            $r["email"] = "";
        }
        $rows[] = $r;
    }
    return $rows;
}

function obfuscate_name($name)
{
    $parts = explode(" ", $name);
    $obfuscated = "";
    foreach ($parts as $part) {
        $obfuscated .= " " . substr($part, 0, 1);
    }
    return trim($obfuscated);
}

// Const array modelling a set in PHP7.x. Note that the values of 1 are necessary to make isset() work.
// define('WRITE_FIELDS', array(
//     "player_index" => 1,
//     "gender" => 1,
//     "experience" => 1,
//     "throwing_skill" => 1,
//     "fitness" => 1,
//     "height" => 1,
//     "team" => 1,
//     "team_position" => 1,
// ));

function update_team_assignments_in_database($players)
{
    if (count($players) == 0) {
        return;
    }
    $con = create_connection();

    $query = "REPLACE INTO team_assignment VALUES ";
    $numFields = 0;
    foreach ($players as $index => $player_data) {
        if ($numFields > 0) {
            $query .= ", ";
        }
        $query .= "(" . $player_data["player_index"] . ", " . $player_data["team"] . ", " . $player_data["team_position"] . ", " . $player_data["is_captain"] . ")";
        $numFields++;
    }
    print $query . "\n";
    $sth = $con->query($query);
    if (!$sth) {
        echo mysqli_error($con);
        die();
    }
    print "Updated team assignment for " . $numFields . " player(s).";
}

function update_team_assignments_in_json($updates)
{
    // This more or less reinvents the wheel and provides a database with json backend.
    $filename = "data/players.json";

    // Read players.
    $handle = fopen($filename, "r");
    $contents = fread($handle, filesize($filename));
    $players = JSON_TO_PHP($contents);
    fclose($handle);

    // Incorporate updates. Should really use an index here. However, this is just a quick-win solution to pass the Udacity requirements.
    foreach ($updates as $update) {
        // Search matching entry in $players.
        for ($i = 0; $i < count($players); $i++) {
            if ($players[$i]["player_index"] == $update["player_index"]) {
                echo "player_index: ";
                print_r($players[$i]);
                echo " update: ";
                print_r($update);
                // Update.
                foreach ($update as $key => $newValue) {
                    $players[$i][$key] = $newValue;
                }
                break;
            }
        }
    }

    // Write updated players.
    $handle = fopen($filename, "w");
    fwrite($handle, PHP_TO_JSON($players));
    fclose($handle);
}

// Authenthication. TODO(Jonas): Add existence check for the file.
// NOTE(Jonas): This has been disabled. For the Udacity submission, obfuscated data will be used, so no need to protect that.
// include("../users.php");  // loads $USERS
$read = 1;
$write = 1;
// if (isset($_GET["user"]) and $_GET["user"] == "readonly") {
//     $read = 1;
// } elseif (!(isset($_GET["user"]) and !isset($_GET["pass"])) and
//     $USERS[$_GET["user"]] !== $_GET["pass"]) {
//     print "{ \"error\": \"Not authenticated.\" }";
//     return;
// } else {
//     $read = 1;
//     $write = 1;
// }

if (isset($_GET["action"])) {
    // TODO(Jonas): Use one backend to rule them all (merge with payments backend).
    if ($_GET["action"] === "updateTeamAssignment" and $write) {
        $data = JSON_to_PHP($_POST["entry"]);
        print_r($data);
        update_team_assignments_in_json($data);
        // update_team_assignments_in_database($data);
    }
    // if ($_GET["action"] === "fetchAll" and $read) {
    //     $data = fetch_all_data_from_database(isset($_GET["obfuscate"]));
    //     print PHP_to_JSON($data);
    // }
}
