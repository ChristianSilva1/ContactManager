var urlBase = 'http://group15apps.xyz/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
var getuserID;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	var tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);
				localStorage.setItem('userid', jsonObject.id);
				userId = localStorage.getItem('userid');
				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				getuserID = userId;
				saveCookie();

				window.location.href = "color.html";
				console.log(userId);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignUp()
{
	//Set this back to 0
	userId = 0;
	//Initialize vars to input in signup.html
	firstName = document.getElementById("signUpFirstName").value;
	lastName = document.getElementById("signUpLastName").value;
	//Declare and initialize username and password from input
	var userName = document.getElementById("signUpName").value;
	var password1 = document.getElementById("signUpPassword1").value;
	var password2 = document.getElementById("signUpPassword2").value;

	document.getElementById("signUpResult").innerHTML = "";


	if (password1 !== password2)
	{
		document.getElementById("loginResult").innerHTML = "Passwords do not match!";
		return;
	}

	var password = password1;
	//API Vocab Class
	var tmp = {firstname:firstName, lastname:lastName, login:userName, password:password};
	var jsonPayload = JSON.stringify( tmp );
	//URL for Register.php
	var url = urlBase + '/Register.' + extension;
	//Server Request
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");


	try {
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200) {
					var jsonObject = JSON.parse(xhr.responseText);

					userId = jsonObject.id;
					firstName = jsonObject.firstName;
					lastName = jsonObject.lastName;

					saveCookie();
					//Back to index
					window.location.href = "http://group15apps.xyz";
				}
			};

			xhr.send(jsonPayload);

	} catch (err) {
		//Error Notice
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	userId = localStorage.getItem('userid')
	var addFirst = document.getElementById("newContactFirst").value;
	var addLast = document.getElementById("newContactLast").value;
	var addEmail = document.getElementById("newContactEmail").value;
	var addPhone = document.getElementById("newContactPhone").value;
	console.log(userId);
	document.getElementById("contactAddResult").innerHTML = "";

	if(addFirst === '' || addLast === '' || addEmail === '' || addPhone === '')
	{
		document.getElementById("contactAddResult").innerHTML = "Please fill all fields";
		return;
	}

	var tmp = { id: userId, addFirstName: addFirst, addLastName: addLast, addEmail: addEmail,	addPhoneNumber: addPhone};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added, redirecting to main page....";
			}
			window.setTimeout(function(){
        // Move to a new location or you can do something else
        window.location.href = "color.html";
    }, 5000);
			addContactToTable(addFirst, addLast, addPhone, addEmail, userId);
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function searchColor()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";

	var colorList = "";

	var tmp = {search:srch,userId:userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/SearchColors.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );

				for( var i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

function addRow(obj)
{
	var row = `<tr scope="row" class="test-row-${obj.contactID}">
								<td id="contactID-${obj.contactID}" class="d-none" data-testid="${obj.contactID}">${obj.contactID}</td>
								<td id="firstName-${obj.contactID}" data-testid="${obj.contactID}">${obj.firstName}</td>
								<td id="lastName-${obj.contactID}" data-testid="${obj.contactID}">${obj.lastName}</td>
								<td id="email-${obj.contactID}" data-testid="${obj.contactID}">${obj.email}</td>
								<td id="phone-${obj.contactID}" data-testid="${obj.contactID}">${obj.phone}</td>
								<td>

								</td>
							</tr>`

	$('#tests-table').append(row)
}

function displayTable()
{
	// Package a JSON payload to deliver to the DisplayTable Endpoint with
	// the UserID in order to display their contacts.
	userId = localStorage.getItem('userId');
  var jsonPayload =
  	'{"UserID" : "' + userId + '"}';
	var url = urlBase + '/DisplayContacts.' + extension;
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// Basic try and catch to ensure that any server code errors are
	// handled properly.
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
				console.log("Success in displayTable()");
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log("Failure in displayTable()");
	}

	var contactList = JSON.parse(xhr.responseText);

	// For each contact in the JSON array, the contact's
	// information will be added to the table.
	for (var i in contactList)
  {
  	addRow(contactList[i]);
  }
}
