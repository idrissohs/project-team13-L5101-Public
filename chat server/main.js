function ping(){

	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","http://localhost:3000/", true);
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			console.log(xmlhttp.responseText);
		}
	}
	
	xmlhttp.send();
}

function chatRequest(){
	
	var message = document.getElementById("form").elements["message"].value;
	var data = {};
	
	data.message = message;
	
	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
		contentType: 'application/json',
		url: 'http://localhost:3000/',						
		success: function(data) {
			console.log(JSON.stringify(data));
		}
	});
}

window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://localhost:3000');
    var field = document.getElementById("message");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("chat");
	var name = document.getElementById("name");
 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
				html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
			content.scrollTop = content.scrollHeight;
        } else {
            console.log("There is a problem:", data);
        }
    });
	
	// when enter is pressed, send
	$("#message").keyup(function(e) {
		if(e.keyCode == 13) {
			sendMessage();
		}
	});
 
    sendButton.onclick = sendMessage = function() {
        if(name.value == "") {
            alert("Please type your name!");
        } else {
            var text = field.value;
            socket.emit('send', { message: text, username: name.value });
			field.value = "";
        }
    };
 
}
