<?php
	// Trigger Composer's autoload:
	require __DIR__ . '/vendor/autoload.php';

	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;


	function sendConfirmationmail($name, $tomail, $origin, $gender, $experience, $throwing_skill, $fitness, $height, $arrival, $notes, $registrationPhase)
	{
		// Include login informations for the gmail account.
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

		// Format mail with all submitted information.
		$message = 'Dear ' . $name . ',<br><br>

		you have successfully registered for the MischMasch Hat Tournament with the following information:<br>
			<dl class="dl-horizontal">
			    <dt>Name</dt><dd>' . $name . '</dd>
			    <dt>Hometeam</dt><dd>' . $origin . '</dd>
			    <dt>Gender</dt><dd>' . $gender . '</dd>
			    <dt>Years of Experience</dt><dd>' . $experience . '</dd>
			    <dt>Throwing Skill Level (0-6)</dt><dd>' . $throwing_skill . '</dd>
			    <dt>Fitness Skill Level (0-6)</dt><dd>' . $fitness . '</dd>
			    <dt>Heigh</dt><dd> ' .$height . ' cm</dd>
			    <dt>Arrival</dt><dd>' . $arrival . '</dd>
			    <dt>Additional Notes</dt><dd>' . $notes . '</dd>
			</dl><br>';
		if ($registrationPhase == 1)
		{
			$message .= '<br>

			--<br>
			We are happy to see you soon in Freiburg :)<br>

			Your MischMasch-Team';
		}
		else if ($registrationPhase == 2)
		{
			$message .= 'We already have a lot of registrations for this years MischMasch, but you are on the waiting list. We will give you a notice if a spot opens up.<br>Your MischMasch-Team';
		}
		else
		{
			$message .= 'We already have a lot of registrations for this years MischMasch, but you are on the waiting list. We will give you a notice if a spot opens up.<br>Your MischMasch-Team';
		}

		echo '<div class="alert alert-info">' . $message . '</div>';

		$mail->addAddress($tomail);
		$mail->ContentType = 'text/html; charset=\'utf-8\'\r\n';
		$mail->Subject = 'MischMasch 19 - Registration';
		$mail->msgHTML($message);

		// Send Mail, check success.
		if (!$mail->send())
		{
			echo '
				<div class="alert alert-warning">
					<strong>Unable to send a confirmation Mail:</strong> ' . $mail->ErrorInfo . '
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
