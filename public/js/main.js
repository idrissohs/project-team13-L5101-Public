$(document).ready(function(){
	
	
	// Sign up form code starts
	
	$("#SignUp").click(function(e) {
		$("#signupform").load("html/SignupForm.html");
	});
	

	function checklogin(){
		if (Parse.User.current()) {
			$("#currentUser").html("Logged in as"+Parse.User.current().get("username"));
			$("#logout").html('<button id="logout" class="nav navbar-nav navbar-right"> log out</button>');
			$("#SignUp").hide();
		}
		else{
			$("#currentUser").load("html/LoginForm.html");
		}
	}
	checklogin();
	
	

})