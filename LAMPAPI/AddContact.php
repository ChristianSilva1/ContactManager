<?php
ini_set('display_errors', 'On');
ini_set("error_log", "/tmp/php.log");
error_reporting(E_ALL);
	$inData = getRequestInfo();

	$UserId = $inData["id"];
	$ContactFirstName = $inData["addFirstName"];
	$ContactLastName = $inData["addLastName"];
	$Email = $inData["addEmail"];
	$Phone = $inData["addPhoneNumber"];

	$conn = new mysqli("localhost", "group15", "group15!!", "contact_manager");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
			$stmt = $conn->prepare("INSERT INTO Contacts (UserId, FirstName, LastName, Email, Phone) VALUES (?,?,?,?,?)");
			$stmt->bind_param("sssss", $UserId, $ContactFirstName, $ContactLastName, $Email, $Phone);
		  	$stmt->execute();
			$stmt->close();
			$conn->close();
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
