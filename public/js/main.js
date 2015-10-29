$(document).ready(function(){
	
	
	// Sign up form code starts
	
	$("#SignUp").click(function(e) {
		$("#signupform").load("html/SignupForm.html");
	});
	

	function checklogin(){
		if (Parse.User.current()) {
			$("#currentUser").html("Logged in as"+Parse.User.current().get("username"));
			$("#SignUp").hide();
		}
		else{
			$("#currentUser").load("html/LoginForm.html");
		}
	}
	checklogin();
	
	

})