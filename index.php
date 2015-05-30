<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>25th MischMasch HAT Player Information</title>
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
<div id="masthead" class="jumbotron masthead">
  <h1>25th MischMasch Player Information</h1>
</div>
<div class="container">
  <div class="row">
    <div class="col-md-12">
<?php
if (!$_POST['sent']) {
  echo '
      <div class="alert alert-info">
        <p>
          <strong>Welcome!</strong> Please fill in the fields below and click on submit. We will use this information to set up the teams.
        </p>
      </div>
       ';
} else {
  error_reporting(E_ALL);

  /* Open and check connection */
  $con = mysqli_connect("dd16322.kasserver.com", "d01b650f", "zngowffmurMVw5Zo", "d01b650f");
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
}

?>

    </div>
    <div class="col-md-8">

      <!-- formular -->
      <form class="form-horizontal" action="index.php" method="post">
        <div class="form-group">
          <label class="col-md-4 control-label" for="inputXYZ">Full Name</label>
          <div class="col-md-8">
            <input id="input1" class="form-control" type="TYPE" name="name" />
            <input type="hidden" name="sent" value="1" />
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-4 control-label" for="inputXYZ">Origin (City, Country)</label>
          <div class="col-md-8">
            <input id="input2" class="form-control" type="TYPE" name="origin" />
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-4 control-label" for="inputXYZ">Gender</label>
          <div class="col-md-8">
            <select id="gender" class="form-control" name="gender">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
        </div>


        <hr/>

        <div class="form-group">
          <label class="col-md-4 control-label" for="inputXYZ">What's the name of your regular team?</label>
          <div class="col-md-8">
            <input id="input3" class="form-control" type="TYPE" name="team" />
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-4 control-label" for="inputXYZ">How many tournaments have you played in 2014?</label>
          <div class="col-md-8">
            <select id="numTournaments" class="form-control" name="num_tournaments">
              <option>None</option>
              <option>1-2</option>
              <option>3-5</option>
              <option>More (Choose this option if you counted for more than 30 seconds.)</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-4 control-label" for="inputXYZ">Which position is your favourite?</label>
          <div class="col-md-8">
            <select id="position" class="form-control" name="position">
              <option>Receiver</option>
              <option>Handler</option>
              <option>Both</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-4 control-label" for="inputXYZ">How do you rate your throwing skills?</label>
          <div class="col-md-8">
            <select id="throwingSkill" class="form-control" name="throwing_skill">
              <option>Basic (I can throw straight backhand and forehand.)</option>
              <option>Advanced (I throw insides and outsides in tournament games.)</option>
              <option>Pro (I throw inside, outside, both backhand and side-arm at variable distance with decent success.)</option>
              <option>Allstar (There is no throw I can't throw, no matter who defends me.)</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-4 control-label" for="inputXYZ">How do you rate your current fitness and athletic condition?</label>
          <div class="col-md-8">
            <select id="fitness" class="form-control" name="fitness">
              <option>Panda: Uh...I used to be in better shape, though!</option>
              <option>Hedgehog: Advantage comes from cunningness.</option>
              <option>Gnu: I am not the fastest, but can run for hours.</option>
              <option>Cheetah: Fast, but poor stamina.</option>
              <option>Road Runner: I am super fast and super fit.</option>
            </select>
          </div>
        </div>

        <hr/>

        <div class="form-group">
          <label class="col-md-4 control-label" for="inputXYZ">When will you arrive?</label>
          <div class="col-md-8">
            <select id="arrival" class="form-control" name="arrival">
              <option>On Friday, in time for the team announcement and get-together (about 8.30pm).</option>
              <option>On Friday, later the night.</option>
              <option>On Saturday, for the famous MischMasch breakfast.</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-4 control-label" for="inputXYZ">Notes, questions and suggestions (add your actual arrival time here, maybe we will postpone parts of the program)</label>
          <div class="col-md-8">
            <textarea id="notes" class="form-control" rows="3" name="notes"></textarea>
          </div>
        </div>

        <div class="form-group">
            <button type="submit" class="btn btn-primary btn-lg center-block">Submit</button>
        </div>
      </form>

    </div>
    <div class="col-md-4">
      <!-- flyer -->
      <img class="img-responsive" src="flyer.png" alt="flyer 2014" />
    </div>
  </div>
</div>
<hr>

</body>
</html>
