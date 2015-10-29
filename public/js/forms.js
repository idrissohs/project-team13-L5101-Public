$(document).ready(function(){
    
      $("#register-form").submit(function(e) {
	e.preventDefault();
	console.log("here");
	if ($("reg_password").val() == $("#reg_password_confirm").val()) {
	    signUpUser();
	}
	
	
      });
      
      $("#login").submit(function(e) {
	var user= new Parse.User;
	user.set("username", $("#user").val());
	user.set("password", $("#pass").val());
	user.logIn({
	    success: function(user) {
		console.log("you are logged in");
	    },
	    error: function(user, error) { 
		console.log("login failed"+ error.message);
	    }
	    
	});
	checklogin();
      });
      function checklogin(){
		if (Parse.User.current()) {
			$("#currentUser").html("Logged in as"+Parse.User.current().get("username"));	//code
		}
		else{
			$("#currentUser").load("html/LoginForm.html");
		}
	}
	checklogin();
      function signUpUser() {
		var user = new Parse.User;
		
		user.set("username", $("#reg_username").val());
		user.set("password", $("#reg_password").val());
		user.set("email", $("reg_email").val());
		
		user.signUp(null, {
		  success: function(user) {
			alert("You have signed up!");
		  },
		  error: function(user, error) {
			// Show the error message somewhere and let the user try again.
			alert("Error: " + error.code + " " + error.message);
			$('#signUpForm').trigger("reset");
		  }
		});
	}
}