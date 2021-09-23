<?php
ini_set('display_errors', 'On');
ini_set("error_log", "/tmp/php.log");
error_reporting(E_ALL);
$inData = getRequestInfo();

  $contactId = $inData["id"];
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

			$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Email = ?, Phone = ? WHERE id = ?");
			$stmt->bind_param("sssss", $ContactFirstName, $ContactLastName, $Email, $Phone, $contactId);
		  	$stmt->execute();
			$result = $stmt->get_result();
			returnWithError($contactId);

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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}


?>
