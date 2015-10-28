$(document).ready(function(){
	
	
	// Sign up form code starts
	$("#signUpForm").submit(function(e){
		e.preventDefault();
		
		signUpUser();
	})
	
	function signUpUser(){
		var user = new Parse.User;
		
		user.set("username", $("#signUpForm #userName").val());
		user.set("password", $("#signUpForm #password").val());
		
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
	
	// Sign up form code ends
	
})