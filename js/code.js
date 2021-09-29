var urlBase = 'http://group15apps.xyz/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
var contactID = 0;
var displayUsername = "";

function doLogin(language)
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	displayUsername = login;

	if(login === '' || password === '')
	{
		if (language) {
			document.getElementById("loginResult").innerHTML = "Please enter your username and password";
			return;
		} else {
			document.getElementById("loginResult").innerHTML = "Por favor ingrese un nombre de usuario y contraseña";
			return;
		}

	}
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
					if (language) {
						document.getElementById("loginResult").innerHTML = "Username or password is incorrect";
						return;
					} else {
						document.getElementById("loginResult").innerHTML = "Nombre de usuario o contraseña incorrecto";
						return;
					}

				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				getuserID = userId;
				saveCookie();

				if (language) {
					window.location.href = "contacts.html";
					console.log(userId);
				} else {
					window.location.href = "contactsSpanish.html";
					console.log(userId);
				}

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignUp(language)
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
	if(firstName === '' || lastName === '' || userName === '' || password1 === '')
	{
		if (language) {
			document.getElementById("signUpResult").innerHTML = "Please fill all fields";
			return;
		} else {
			document.getElementById("signUpResult").innerHTML = "Por favor llenar todos los campos";
			return;
		}

	}

	if (password1 !== password2)
	{
		if (language) {
			document.getElementById("signUpResult").innerHTML = "Passwords do not match!";
			return;
		} else {
			document.getElementById("signUpResult").innerHTML = "Las contraseñas no coinciden!";
			return;
		}
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
					if (language) {
						window.location.href = "http://group15apps.xyz";
					} else {
						window.location.href = "http://group15apps.xyz/indexSpanish.html";
					}
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

function addContact(language)
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
		if (language) {
			document.getElementById("contactAddResult").innerHTML = "Please fill all fields";
			return;
		} else {
			document.getElementById("contactAddResult").innerHTML = "Por favor llenar todos los campos";
			return;
		}

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
				if (language) {
					document.getElementById("contactAddResult").innerHTML = "Contact has been added, redirecting to main page....";
				} else {
					document.getElementById("contactAddResult").innerHTML = "Contacto ha sido agregado, redireccionando página principal....";
				}

			}
			window.setTimeout(function(){
        // Move to a new location or you can do something else
				if (language) {
					window.location.href = "contacts.html";
				} else {
					window.location.href = "contactsSpanish.html";
				}

    }, 3000);

		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}
//Modify this
function searchContact(language)
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
				console.log(typeof jsonObject.results);
				if(typeof jsonObject.results === 'undefined'){
					if (language) {
						contactList += '<tr>';
						contactList += '<td>No Record Found</td>'
						contactList += '</tr>';
					} else {
						contactList += '<tr>';
						contactList += '<td>Records no Encontrados</td>'
						contactList += '</tr>';
					}

				}
				else
				{
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
							contactList += '<td>' + jsonObject.results[i].ID + '</td>';
							contactList += '<td>' + jsonObject.results[i].FirstName + '</td>';
							contactList += '<td>' + jsonObject.results[i].LastName + '</td>';
							contactList += '<td><a href="mailto:"+jsonObject.results[i].Email>' + jsonObject.results[i].Email + '</a></td>';
							contactList += '<td>' + jsonObject.results[i].Phone + '</td>';
							contactList += '<td> <button type="button" id="deleteContactButton" class="buttons" onclick="deleteContact('+contactID+');"><img id="smallButton" src="images/trash.png" alt="delete"></button>'
							contactList += '<button type="button" id="editContactButton" class="buttons" onclick="openForm('+contactID+');"><img id="smallButton" src="images/edit.png" alt="edit"></button> </td>'
							contactList += '</tr>';
						}
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
	var result = confirm("Delete Contacto?");
	if (!result) {
	    return;
	} else {

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

}

function openForm(CID) {
	readCookie();
	localStorage.setItem('contactid', CID);
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
	document.getElementById("contactEditResult").innerHTML = "";
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
	document.getElementById("contactEditResult").innerHTML = "";

	if(addFirst === '' || addLast === '' || addEmail === '' || addPhone === '')
	{
		document.getElementById("contactEditResult").innerHTML = "Please fill all fields";
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
				document.getElementById("contactEditResult").innerHTML = "Changes have been saved, redirecting to main page....";
			}
        // Move to a new location or you can do something else
        window.location.href = "contacts.html";


		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactEditResult").innerHTML = err.message;
	}
}
