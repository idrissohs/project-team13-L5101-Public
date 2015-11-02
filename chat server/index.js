var express = require("express"), 
	cors = require('cors'), 
	bodyParser = require("body-parser");
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var chatBroadcast = function(req, res){
	
	if (!req.body) console.log(400);
	
	var message = req.body.message;
	res.send(message + " was received!");
};
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.use(cors());
app.post('/', chatBroadcast);

var io = require('socket.io').listen(app.listen(3000));

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'Welcome to the chat!' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
		
    });
});