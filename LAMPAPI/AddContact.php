<?php
	$inData = getRequestInfo();

	$First = $inData["firstName"];
	$Last = $inData["lastName"];
	$Phone =$inData["phoneNumber"];
	$Email = $inData["email"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "group15", "group15!!", "contact_manager");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (UserID,FirstName,LastName,Email,Phone) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $userId, $firstName, $lastName, $email, $phoneNumber);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
