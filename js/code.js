var urlBase = 'http://group15apps.xyz/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
var contactID = 0;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	//Empty fields cannot login
	if (login === "" || password === "") {
		document.getElementById("loginResult").innerHTML = "Please fill all fields";
		return;
	}

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

				window.location.href = "contacts.html";
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

	if (firstName == "" || lastName === "" || userName === "" || password1 == "" || password2 === "") {
		document.getElementById("signUpResult").innerHTML = "Please fill all fields";
		return;
	}
	if (password1 !== password2)
	{
		document.getElementById("signUpResult").innerHTML = "Passwords do not match!";
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
        window.location.href = "contacts.html";
    }, 5000);

		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function searchContact()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	var contactList = "";

	var tmp = {search:srch,userId:userId};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/SearchContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactSearchResult").innerHTML = "Contacts has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				for( var i=0; i<jsonObject.results.length; i++ )
				{
						contactID = jsonObject.results[i].ID;
						contactFirst = jsonObject.results[i].FirstName;
						contactLast = jsonObject.results[i].LastName;
						contactEmail = jsonObject.results[i].Email;
						contactPhone = jsonObject.results[i].Phone;
							// Putting here
							saveCookie();
							contactList += '<tr>';
							//contactList += '<td>' + jsonObject.results[i].ID + '</td>';
							contactList += '<td>' + jsonObject.results[i].FirstName + '</td>';
							contactList += '<td>' + jsonObject.results[i].LastName + '</td>';
							contactList += '<td>' + jsonObject.results[i].Email + '</td>';
							contactList += '<td>' + jsonObject.results[i].Phone + '</td>';
							contactList += '<td> <button type="button" id="deleteContactButton" class="buttons" onclick="deleteContact('+contactID+');"> Delete </button>'
							contactList += '<button type="button" id="editContactButton" class="buttons" onclick="setContact('+contactID+');">Edit</button> </td>'
							contactList += '</tr>';
				}

				document.getElementsByTagName("tbody")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function deleteContact(CID)
{
	readCookie();
	var tmp = {contactID: CID};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/Delete.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				console.log("Deleted");
				searchContact();
			}
		};
	xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactEditResult").innerHTML = "Could not delete";
	}
}

function setContact(CID)
{
	readCookie();
	window.location.href = "edit.html";
	localStorage.setItem('contactid', CID);
}

function editContact()
{
	var contactID = localStorage.getItem('contactid');
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

	var tmp = { id: contactID, addFirstName: addFirst, addLastName: addLast, addEmail: addEmail,	addPhoneNumber: addPhone};
	var jsonPayload = JSON.stringify( tmp );

	var url = urlBase + '/UpdateContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				console.log("EDITTED");
				document.getElementById("contactAddResult").innerHTML = "Changes have been saved, redirecting to main page....";
			}
			window.setTimeout(function(){
        // Move to a new location or you can do something else
        window.location.href = "contacts.html";
    }, 5000);

		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}
