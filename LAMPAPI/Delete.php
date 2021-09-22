<?php

  $inData = getRequestInfo();

  $contactID = $inData["ID"];

  $conn = new mysqli("localhost", "group15", "group15!!", "contact_manager");
  if ($conn->connect_error)
  {
    returnWithError( $conn->connect_error );
  }
  else
  {
    $sql = "DELETE FROM Contacts WHERE ID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $contactID);
    $stmt->execute();
    returnWithError($contactID);

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
