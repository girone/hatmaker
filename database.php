<?php

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

?>
