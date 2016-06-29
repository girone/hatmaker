<?php
$TOURNAMENT_NUMBER = "27th";
$YEAR = "2016";

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title><?php echo $TOURNAMENT_NUMBER; ?> MischMasch HAT Player Information</title>
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
<div id="masthead" class="jumbotron masthead">
  <h1><?php echo $TOURNAMENT_NUMBER; ?> MischMasch Player Information</h1>
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
  $con->set_charset("utf8");

  $name             = $con->real_escape_string($_POST['name']);
  $origin           = $con->real_escape_string($_POST['origin']);
  $gender           = $con->real_escape_string($_POST['gender']);
  $experience       = $con->real_escape_string($_POST['experience']);
  $throwing_skill   = $con->real_escape_string($_POST['throwing_skill']);
  $fitness          = $con->real_escape_string($_POST['fitness']);
  $height           = $con->real_escape_string($_POST['height']);
  $arrival          = $con->real_escape_string($_POST['arrival']);
  $notes            = $con->real_escape_string($_POST['notes']);
  $time             = date('l jS \of F Y h:i:s A');

  /* Make sure the required fields are filled. */
  $requiredVariables = array(
    "name" => $name,
    "origin" => $origin,
    "gender" => $gender,
    "experience" => $experience,
    "throwing_skill" => $throwing_skill,
    "fitness" => $fitness,
    "height" => $height
  );

  foreach ($requiredVariables as $key => $variable) {
    if ($variable == "") {
      echo '
        <div class="alert alert-danger">
          <strong>Error: Missing input in field "<em>' . $key . '</em>".</strong>
        </div>
        <button type="button" class="btn btn-primary btn-lg center-block" onclick="history.back()">Retry, please.</button>
      ';
      die();
    }
  }

  $sql="INSERT INTO MischMasch (name,    origin,    gender,    experience,    throwing_skill,    fitness,    height,    arrival,   notes,    time)
                        VALUES ('$name', '$origin', '$gender', '$experience', '$throwing_skill', '$fitness', '$height', '$arrival', '$notes', '$time')";

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
    <div id="form_container" class="col-md-8">

      <!-- formular -->
      <form class="form-horizontal" action="index.php" method="post">
        <div class="form-group">
          <label class="col-md-4 control-label" for="input1">Full Name</label>
          <div class="col-md-8">
            <input id="input1" class="form-control" type="text" name="name" />
            <input type="hidden" name="sent" value="1" />
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-4 control-label" for="input2">Origin (City, Country and Team)</label>
          <div class="col-md-8">
            <input id="input2" class="form-control" type="text" name="origin" />
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-4 control-label" for="gender">Gender</label>
          <div class="col-md-8">
            <select id="gender" class="form-control" name="gender">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
        </div>

        <hr/>

        <div class="form-group">
          <label class="col-md-4 control-label" for="experience">For how many years do you play Ultimate?</label>
          <div class="col-md-8">
            <input id="experience" class="form-control" type="text" name="experience" />
          </div>
        </div>

        <div class="form-group">
          <label class="col-md-4 control-label" for="throwingSkill">How do you rate your throwing skills?</label>
          <div class="col-md-8">
            <select id="throwingSkill" class="form-control" name="throwing_skill">
              <option>0 (Rooky)</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6 (Mastermind)</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-4 control-label" for="fitness">How do you rate your current fitness and athletic condition?</label>
          <div class="col-md-8">
            <select id="fitness" class="form-control" name="fitness">
              <option>0 (Rooky)</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6 (Mastermind)</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-4 control-label" for="height">How tall are you in <a href="http://www.metric-conversions.org/length/feet-to-centimeters.htm" target="_blank">cm</a>?</label>
          <div class="col-md-8">
            <input id="height" class="form-control" type="text" name="height" />
          </div>
        </div>

        <hr/>

        <div class="form-group">
          <label class="col-md-4 control-label" for="arrival">When will you arrive?</label>
          <div class="col-md-8">
            <select id="arrival" class="form-control" name="arrival">
              <option>On Friday, in time for the team announcement and get-together (about 8.30pm).</option>
              <option>On Friday, later the night.</option>
              <option>On Saturday, for the famous MischMasch breakfast.</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-4 control-label" for="music">Music</label>
          <div class="col-md-8">
            <input id="music" class="form-control" type="TYPE" name="music" placeholder="I would like to hear this track during the tournament." />
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-4 control-label" for="notes">Notes, questions and suggestions (Need airport pickup?)</label>
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
      <img class="img-responsive" src="mmLogo2016.png" alt="flyer <?php echo $YEAR; ?>" />
    </div>
  </div>
</div>
<hr>

</body>
</html>
