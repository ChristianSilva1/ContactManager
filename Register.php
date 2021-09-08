<?php
$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
    
    // Connect with database with paramaters (host, username, password, database) and store the connection in var 'conn'
	$conn = new mysqli("localhost", "group15", "group15!!", "COP4331"); 
    
    // If statement to make sure connection was successful
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{	
		// Store corresponding information from json to seperate variables
		$firstname = $inData['firstname'];
		$lastname = $inData['lastname'];
		$username = $inData['login'];
		$password = $inData['password'];
		 
        // Prepare SQL statements for execution using table names in database
		$stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES (?, ?, ?, ?)");
		
		$stmt->bind_param("ssss", $firstname, $lastname, $username, $password);

        // Execute prepared SQL statements
		$stmt->execute();
		
		returnWithError("Success");

		// Close SQL statement as well as connection to database
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
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>