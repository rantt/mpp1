var express = require('express'),
		util = require('util'),
    app = express(),
    http = require('http').Server(app),
		io = require('socket.io').listen(http);



// app.get('/', function(req, resp) {
// });
app.use(express.static(__dirname+'/public'));

var client
io.on('connection', function(socket) {
	console.log('Connection Established');
	console.log('sockid =' + socket.id);

	socket.on('x', function(x) {
		console.log('x: ' + x);
		client = socket.id;
	});

	socket.on('y', function(y) {
		console.log('y: ' + y);
		client = socket.id;
	});


	socket.on('sender', function(sender) {
		console.log('sender: ' + sender);
		client = socket.id;
	});

	socket.on('disconnect', function() {
		console.log('player disconnected');
	});

	socket.join('sesssionId');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

// app.use(express.static('public'));






