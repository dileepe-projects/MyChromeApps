window.onload=function(){



document.getElementById("login").addEventListener("click", checkUser);

}


function checkUser() {	
	
						
						var emailid = document.querySelector("#emailid").value;
						//var domain = "";
						
						var msg = document.querySelector("#msg");
						//Hardcoding user email ids.
						var users = new Array("dileep.ekambaram@live.com", "querytracker@live.com");
						
						
						//if (emailDomainCheck(emailid, domain)) {
  						
  								if(isInArray(emailid, users))

									{
																						
											var login = document.getElementById("login");	
											var dmodal = document.createAttribute("data-dismiss"); 
											dmodal.value = "modal";
											login.setAttributeNode(dmodal); 
											sessionStorage.currentuser = emailid; //session storage
											var currentuser = sessionStorage.currentuser;											
											hide(document.getElementById('loginbar'));
											show(document.getElementById('newloginbar'));
											document.querySelector("#user").innerHTML = " " + currentuser;																			 
											 
									 }
						
								else 
								{
																		
									show(document.getElementById('msgdiv')); 	
									msg.innerText = "*User Not Registered! Contact Admin";

								}

						//}

						/*else 

							{
																	
									show(document.getElementById('msgdiv')); 	
									msg.innerText = "*Not Valid Email ID";									

							}*/
						

						
						
	
	        		 }

function isInArray(value, array) {
  						return array.indexOf(value) > -1;
					 }

function hide (elements) {
						  elements = elements.length ? elements : [elements];
						  for (var index = 0; index < elements.length; index++) {
							  elements[index].style.display = 'none';
					  	  	}
						 }

function show (elements) {
						  elements = elements.length ? elements : [elements];
						  for (var index = 0; index < elements.length; index++) {
							    elements[index].style.display = 'block';
							  }
						 }					

function emailDomainCheck(email, domain)
{
    
    var email = email.toLowerCase();
    var parts = email.split('@');
    domain = domain + ".com";
   
    if (parts.length === 2) {
        if (parts[1] === domain) {

            return true;
        }
    }
    return false;
}