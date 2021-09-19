<?php

$inData = getRequestInfo();

class Contact
{
 public $contactID = "";
 public $userID = "";
 public $firstName = "";
 public $lastName  = "";
 public $email = "";
 public $phone = "";
}

$users[] = array();

    $conn = new mysqli("localhost", "group15", "group15!!", "contact_manager");
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        // find any contacts associated with a userID
        $stmt = $conn->prepare('SELECT * FROM Contacts WHERE userID=?');
        $stmt->bind_param("s", $userID);
        $stmt->execute();

        while($row = mysqli_fetch_array($stmt))
          {
              $newContact = new Contact();

                $newContact->contactID = $row['ID'];
                $newContact->userID = $row['UserID'];
                $newContact->firstName = $row['FirstName'];
                $newContact->lastName = $row['LastName'];
                $newContact->email = $row['Email'];
                $newContact->phone = $row['Phone'];

                $users[] = $newContact;
            }
            unset($users[0]);
 sendResultInfoAsJson($users);
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
