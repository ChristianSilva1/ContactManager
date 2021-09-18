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
		if (createContact($conn, $inData["id"], $inData["addFirstName"], $inData["addLastName"], $inData["addEmail"], $inData["addPhoneNumber"]))
			{
				$contactInfo = getContactInfo($conn, $ContactFirstName, $ContactLastName);
				returnWithInfo($contactInfo["ID"]);
				exit();
			}
		else
			{
				returnWithError("Error creating contact");
				exit();
			}
	}

	function getContactInfo($conn, $ContactFirstName, $ContactLastName)
	{
		$result = $conn->query("SELECT ID, FirstName, LastName, Email, Phone FROM Contacts WHERE FirstName = '$ContactFirstName' AND LastName = '$ContactLastName'") or die($conn->error);
		return $result->fetch_assoc();
	}

	function createContact($conn, $id, $addFirstName, $addLastName, $addEmail, $addPhoneNumber)
	{
		$result = $conn->query("INSERT INTO Contacts (UserId, FirstName, LastName, Email, Phone) VALUES ('$id', '$addFirstName','$addLastName','$addEmail','$addPhoneNumber')");
		return $result;
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
