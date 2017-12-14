var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//resources server
app.use(express.static(__dirname + '/www'));

server.listen(process.env.PORT || 1266, function() {
	var port = server.address().port;
	console.log('Server running on port %s', port);
});

var players = []; //list of all the players on the server

io.on('connection', function(socket) {
	var currentPlayer; //stores the player being referenced by socket
	console.log('user connected');
	
	socket.on('movePlayer', function(data) {
		//console.log('playerData', data.x);
		
		//console.log(data.x);
		//OBSELETE -  -- - - - - -- - - --MAJOR FLAW WITH THIS, it sets it back to original after moving, unless the physical player is moving
		players.forEach(function(player, index, players) {
			if (player.id == data.id) {
				players[index].x = data.x;
				players[index].y = data.y;
				players[index].speed = data.speed;
				players[index].dir = data.dir;
				//console.log('setting index ' + index + ' x pos to ' + data.x);
			}
		});
		
		//DON"T USE THIS because player is moved locally
		//socket.emit('movePlayer', {x: data.x, y: data.y});
		//socket.broadcast.emit('playerData', {id: data.id, x: data.x, y: data.y});
	});
	
	socket.on('sync', function() {
		//sync the game with the server
		socket.emit('playerData', players);
	});
	
	socket.on('joinGame', function(player) {
		currentPlayer = player;
		
		//send the list of current players to the new player
		socket.emit('addPlayers', players); 
		
		//send new player to everybody else
		socket.broadcast.emit('addPlayers', [player]);
	
		//ad new player to the list
		players.push(player);
		console.log(players);
	});
	
	socket.on('disconnect', function() {
		/*for (var i = players.length-1; i >= 0; i--) {
			if (players[i].id == socketID) {
				players.splice(i, 1);
			}
		}*/
		var i = players.indexOf(currentPlayer);
		players.splice(i, 1);
		console.log(currentPlayer.id + ' left.');
		
		socket.broadcast.emit('leaveGame', currentPlayer.id);
	});
});
