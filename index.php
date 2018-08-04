<?php
DEFINE("MAX_PLAYERS", 144);

abstract class RegistrationPhase {
  const OPEN = 1;
  const FULL_BUT_WAITING_LIST_OPEN = 2;
  const CLOSED = 3;
}

include("database.php");

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
if ($playerCount > MAX_PLAYERS) {
  if ($playerCount < MAX_PLAYERS + 20) {
    $registrationPhase = RegistrationPhase::FULL_BUT_WAITING_LIST_OPEN;
  } else {
    $registrationPhase = RegistrationPhase::CLOSED;
  }
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
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css" />
  <link rel="stylesheet" href="style.css" />
  <!--<script type="text/javascript" src="https://www.dropbox.com/static/api/2/dropins.js" id="dropboxjs" data-app-key="967fs58zsni4mpz"></script>-->
  <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
  <script type="text/javascript" src="globals.js"></script>
  <title></title>
</head>
<body>
<div id="masthead" class="jumbotron masthead">
  <h1></h1>
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
            echo 'Nevertheless, you may register for the waiting list. But the odds are good! Please contact the organizers about your chance to get a spot.';
          } else if ($registrationPhase == RegistrationPhase::CLOSED) {
            echo 'Registration is closed, because the waiting list is already too long.';
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
              <option value="male">Male</option>
              <option value="female">Female</option>
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
              <option value="0">0 (Rooky)</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <!-- TODO(Jonas): Next edition, specify what a Mastermind can do -->
              <option value="6">6 (Mastermind)</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-4 control-label" for="fitness">How do you rate your current fitness and athletic condition?</label>
          <div class="col-md-8">
            <select id="fitness" class="form-control" name="fitness">
              <option value="0">0 (Rooky)</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <!-- TODO(Jonas): Next edition, specify how fit a Mastermind is -->
              <option value="6">6 (Mastermind)</option>
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
              <option value="Friday, on time">On Friday, in time for the team announcement and get-together (about 8.30pm).</option>
              <option value="Friday, late">On Friday, later the night.</option>
              <option value="Saturday">On Saturday, for the famous MischMasch breakfast.</option>
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
      <script>
        "use strict";
        $(document).ready(function() {
          $("title").text(getTitle());
          $("h1").text(getTitle());
<?php
  if ($registrationPhase == RegistrationPhase::CLOSED) {
    echo "
          $('input').attr('disabled', 'disabled');
          $('select').attr('disabled', 'disabled');
          $('textarea').attr('disabled', 'disabled');
          $('#submit_button').attr('disabled', 'disabled');
    ";
  }
}
?>
        });
      </script>
    </div>
    <div class="col-md-4">
      <!-- flyer -->
      <img class="img-responsive" src="sticker_small_2018.png" alt="flyer mischmasch" />
    </div>
  </div>
</div>
<hr>

</body>
</html>
