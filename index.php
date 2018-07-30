<?php
$TOURNAMENT_NUMBER = "29th";
$YEAR = "2018";
$MAX_PLAYERS = 144;

abstract class RegistrationPhase {
  const OPEN = 1;
  const FULL_BUT_WAITING_LIST_OPEN = 2;
  const CLOSED = 3;
}

function create_connection() {
  include("credentials.php");
  /* Open and check connection */
  $con = mysqli_connect("sternisko.com", $username, $password, $database);
  if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
  } else {
    //echo "Connection to DB established.";
    $con->set_charset("utf8");
  }
  return $con;
}

function get_player_count() {
  $con = create_connection();
  $sql = "SELECT COUNT(*) FROM MischMasch";
  $res = $con->query($sql);

  if (!$res) {
    echo format_error(mysqli_error($con));
    die();
  }

  $tmp = $res->fetch_all();
  $count = $tmp[0][0];

  $con->close();

  return $count;
}

$registrationPhase = RegistrationPhase::OPEN;

$playerCount = get_player_count();
if ($playerCount > $MAX_PLAYERS) {
  if ($playerCount < $MAX_PLAYERS + 20) {
    $registrationPhase = RegistrationPhase::FULL_BUT_WAITING_LIST_OPEN;
  }
  $registrationPhase = RegistrationPhase::CLOSED;
}

function format_error($err_msg) {
  return '
      <div class="alert alert-danger">
        <strong>Error: <em>' . $err_msg . '</em>". Aborted! Please contact jonas (.) sternisko (@) gmail (.) com and report this error message.</strong>
      </div>
    ';
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title><?php echo $TOURNAMENT_NUMBER; ?> MischMasch HAT Player Information</title>
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" />
  <link rel="stylesheet" href="style.css" />
  <!--<script type="text/javascript" src="https://www.dropbox.com/static/api/2/dropins.js" id="dropboxjs" data-app-key="967fs58zsni4mpz"></script>-->
  <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
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

  if ($registrationPhase != RegistrationPhase::OPEN) {
    echo '
      <div class="alert alert-warning">
        <strong>
          Unfortunately, we have already reached the maximum number of players. ';
          if ($registrationPhase == RegistrationPhase::FULL_BUT_WAITING_LIST_OPEN) {
            echo 'Nevertheless, you may register for the waiting list.';
          }
    echo '
        </strong>
      </div>
       ';
  }
  echo '
      <div class="alert alert-info">
        <p>
          <strong>Welcome!</strong> Please fill in the fields below. We will use this information to contact you and set up the teams.
        </p>
        <ul>
          <li>The first 144 players are automatically acknowledged. Further players will be put on the waiting list.</li>
          <li>We will send you payment information come the end of July. The playersfee has to be payed at least two weeks before the tournament. If you do not pay in time, you might loose your spot.</li>
          <li>If you already payed and cannot make it for whatever reason, we can reimburse your playersfee if you inform us until two weeks before the tournament. Later cancelations are not guaranteed to get the playersfee back.</li>
          <li>Any trouble or questions regarding the registration? Contact <a href="mailto:jonas.sternisko@gmail.com">Jonas</a>.
          <li><em>Add your favourite music to this <a href="https://open.spotify.com/user/evelyn.friedel/playlist/3VYq0RooVTjxklmx1wdJVR?si=zCpfwuY2Qeq3bE9sEAnSXQ">spotify list</a>. We will play the list during the day and on one of our silent-disco channels at the party.</em></li>
          <li>Your data will be treated confidently and stored in a secured database. We will not hand it over to third parties or use it for any other purpose than preparing the tournament. The data will be deleted after the tournament.</li>
        </ul>
      </div>
       ';
} else {
  error_reporting(E_ALL);

  $con = create_connection();

  $name             = $con->real_escape_string($_POST['name']);
  $email            = $con->real_escape_string($_POST['email']);
  $origin           = $con->real_escape_string($_POST['origin']);
  $gender           = $con->real_escape_string($_POST['gender']);
  $experience       = $con->real_escape_string($_POST['experience']);
  $throwing_skill   = $con->real_escape_string($_POST['throwing_skill']);
  $fitness          = $con->real_escape_string($_POST['fitness']);
  $height           = $con->real_escape_string($_POST['height']);
  $arrival          = $con->real_escape_string($_POST['arrival']);
  $notes            = $con->real_escape_string($_POST['notes']);

  /* Make sure the required fields are filled. */
  $requiredVariables = array(
    "name" => $name,
    "email" => $email,
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

  $sql = "INSERT INTO MischMasch (name,    email,    origin,    gender,    experience,    throwing_skill,    fitness,    height,    arrival,    notes)
                          VALUES ('$name', '$email', '$origin', '$gender', '$experience', '$throwing_skill', '$fitness', '$height', '$arrival', '$notes')";
  if (!$con->query($sql)) {
    echo format_error(mysqli_error($con));
    die();
  }
  $con->close();

  if ($registrationPhase != RegistrationPhase::CLOSED) {  // TODO(Jonas): Reword the registration phase stuff.
    echo '
        <div class="alert alert-success">
          <strong>Player added. Thank you and see you in Freiburg!</strong>
        </div>
        <div class="alert alert-info">
          Did you already add your favourite music to the <a href="https://open.spotify.com/user/evelyn.friedel/playlist/3VYq0RooVTjxklmx1wdJVR?si=zCpfwuY2Qeq3bE9sEAnSXQ">spotify list</a>?
        </div>
    ';
  } else {
    echo '
        <div class="alert alert-warning">
          <strong>We have already reached the maximum number of players. You have been added to the waiting list. Expect to hear from us about two weeks before the tournament.</strong>
        </div>
    ';
  }
  echo '
      <div class="alert alert-info">
        <p>Note that there will be no automatic confirmation email, whatsoever. Just trust into this message :)</p>
      </div>
  ';
}

?>

    </div>

    <div id="form_container" class="col-md-8">

<?php
if (!$_POST['sent']) {
?>

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
          <label class="col-md-4 control-label" for="input1">Email</label>
          <div class="col-md-8">
            <!-- TODO(Jonas): Use Bootstrap 4 with input type="email" and auto validation here. Use corresponding new types elsewhere. -->
            <input id="input1" class="form-control" type="text" name="email" />
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
          <label class="col-md-4 control-label" for="experience">For how many years are you playing Ultimate?</label>
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
          <label class="col-md-4 control-label" for="notes">Notes, questions and suggestions (Need airport pickup?)</label>
          <div class="col-md-8">
            <textarea id="notes" class="form-control" rows="3" name="notes"></textarea>
          </div>
        </div>

        <div class="form-group">
            <button id="submit_button" type="submit" class="btn btn-primary btn-lg center-block">Submit</button>
        </div>
      </form>
<?php
  if ($registrationPhase == RegistrationPhase::CLOSED) {
    echo "<script>
      $(document).ready(function() {
        $('input').attr('disabled', 'disabled');
        $('select').attr('disabled', 'disabled');
        $('textarea').attr('disabled', 'disabled');
        $('#submit_button').attr('disabled', 'disabled');
      });
      </script>";
  }
}
?>
    </div>
    <div class="col-md-4">
      <!-- flyer -->
      <img class="img-responsive" src="sticker_small_2018.png" alt="flyer <?php echo $YEAR; ?>" />
    </div>
  </div>
</div>
<hr>

</body>
</html>
