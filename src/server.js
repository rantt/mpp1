var express = require('express'),
		util = require('util'),
    app = express(),
    http = require('http').Server(app),
		io = require('socket.io').listen(http);






// var maze = new Maze(42,30);
// console.log(maze.drawLevel());








// app.get('/', function(req, resp) {
// });
app.use(express.static(__dirname+'/public'));

var client;
var actor;
var clients = [];


io.on('connect', function(socket) {
	console.log('Connection Established');
	console.log('sockid =' + socket.id);

  clients.push(socket.id);
  io.emit('clients', clients);

  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);
    socket.emit('chat message', msg);
  });


	socket.on('player', function(player) {
		console.log('player.x: ' + player.x);
		console.log('player.y: ' + player.y);
    // io.emit('actor', {sid: socket.id, direction: player.direction, x: player.x, y: player.y});
    io.emit('actor', {sid: socket.id, direction: player.direction, x: player.x, y: player.y, frame: player.frame});
	});

	socket.on('sender', function(sender) {
		console.log('sender: ' + sender);
		client = socket.id;
	});

	socket.on('disconnect', function() {
    clients.splice(clients.indexOf(socket.id), 1);
		console.log('player disconnected');
	});

	socket.join('sesssionId');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

// app.use(express.static('public'));


