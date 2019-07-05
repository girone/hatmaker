<?php
	//add PHP-Mailer: https://github.com/PHPMailer/PHPMailer
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'Exception.php';
	require 'PHPMailer.php';
	require 'SMTP.php';
	
	function sendConfirmationmail($name, $tomail, $origin, $gender, $experience, $throwing_skill, $fitness, $height, $arrival, $notes, $registrationPhase)
	{
		//include login informations for the gmail account
		include ("mail_credentials.php");
		
		$mail = new PHPMailer;
		$mail->isSMTP();
		$mail->SetFrom('mischmasch19@gmail.com', 'Rafael Hanna');
		$mail->Host = 'smtp.gmail.com';
		$mail->Port = 587;
		$mail->SMTPSecure = 'tls';
		$mail->SMTPAuth = true;
		$mail->Username = $mailusrname;
		$mail->Password = $mailpasswd;
		
		//Mail Message with all submitted informations
		$message = 'Hi ' . $name . ',<br><br>You successfully registered for the MischMasch Hat Tournament with the following Informations:<br>Name: ' . $name . '<br>Hometeam: ' . $origin . '<br>Gender: ' . $gender . '<br>Years of Experience: ' . $experience . '<br>Throwing Skill Level (0-6): ' . $throwing_skill . '<br>Fitness Skill Level (0-6): ' . $fitness . '<br>Height: ' .$height . ' cm<br>Arrival: ' . $arrival . '<br>Additional Notes: ' . $notes;
		//Tell the player the registration status
		if ($registrationPhase == 1)
		{
			$message .= '<br><br>We are happy to see you soon in Freiburg :)<br>Your MischMasch-Team';
		}
		else if ($registrationPhase == 2)
		{
			$message .= '<br><br>We already have a lot of registrations for this years MischMasch, but you are on the waiting list. We will give you a notice if a spot opens up.<br>Your MischMasch-Team';
		}
		else
		{
			$message .= '<br><br>We already have a lot of registrations for this years MischMasch, but you are on the waiting list. We will give you a notice if a spot opens up.<br>Your MischMasch-Team';
		}
		
		echo $message;
		
		$mail->addAddress($tomail);
		$mail->ContentType = 'text/html; charset=\'utf-8\'\r\n';
		$mail->Subject = 'MischMasch 19 - Registration';
		$mail->msgHTML($message);
		
		//send Mail, check success
		if (!$mail->send())
		{
			//echo 'Mailer Error: ' . $mail->ErrorInfo;
			echo '
				<div class="alert alert-warning">
					<strong>Unable to send a confirmation Mail.</strong>
				</div>
			';
			return false;
		}
		else
		{
			echo '
				<div class="alert alert-success">
					<strong>Confirmation Mail send. It might take a few minutes until the mail gets to you :).</strong>
				</div>
			';
			return true;
		}
	}
?>