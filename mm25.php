<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>25th MischMasch HAT Player Information - Submit</title>
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" />
</head>
<body>
<?php
error_reporting(E_ALL);

/* Open and check connection */
$con = mysqli_connect("dd16322.kasserver.com", "d01b650f", "!zngowffmur!MVw5Zo!", "d01b650f");
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
} else {
  //echo "Connection to DB established.";
}

$name             = $con->real_escape_string($_POST['name']);
$origin           = $con->real_escape_string($_POST['origin']);
$gender           = $con->real_escape_string($_POST['gender']);
$team             = $con->real_escape_string($_POST['team']);
$num_tournaments  = $con->real_escape_string($_POST['num_tournaments']);
$position         = $con->real_escape_string($_POST['position']);
$throwing_skill   = $con->real_escape_string($_POST['throwing_skill']);
$fitness          = $con->real_escape_string($_POST['fitness']);
$arrival          = $con->real_escape_string($_POST['arrival']);
$notes            = $con->real_escape_string($_POST['notes']);
$time             = date('l jS \of F Y h:i:s A');

/*echo
  $name .",<br> ".
  $origin .",<br> ".
  $gender .",<br> ".
  $team .",<br> ".
  $num_tournaments .",<br> ".
  $position .",<br> ".
  $throwing_skill .",<br> ".
  $fitness .",<br> ".
  $arrival .",<br> ".
  $notes .",<br> ".
  $time
  ;*/

/* Make sure the required fields are filled. */
$requiredVariables = array(
  "name" => $name,
  "origin" => $origin,
  "gender" => $gender,
  "num_tournaments" => $num_tournaments,
  "position" => $position,
  "throwing_skill" => $throwing_skill,
  "fitness" => $fitness
);

foreach ($requiredVariables as $key => $variable) {
  if ($variable == "") {
    echo '
      <div class="alert alert-danger">
        <strong>Error: Missing input in field "<em>' . $key . '</em>". Aborted!</strong>
      </div>
    ';
    die();
  }
}


$sql="INSERT INTO MischMasch25 (name, origin, gender, team, num_tournaments, position, throwing_skill, fitness, arrival, notes, time)
  VALUES ('$name', '$origin', '$gender', '$team', '$num_tournaments', '$position', '$throwing_skill', '$fitness', '$arrival', '$notes', '$time')";

if (!$con->query($sql)) {
  echo '
    <div class="alert alert-danger">
      <strong>Error: <em>' . mysqli_error($con) . '</em>". Aborted!</strong>
    </div>
  ';
  die();
}

echo '
    <div class="alert alert-success">
      <strong>Player added. Thank you and see you in Freiburg!</strong>
    </div>
';

mysqli_close($con);
?>

</body>
</html>

