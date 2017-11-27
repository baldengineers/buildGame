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

io.on('connection', function(socket) {
	console.log('user connected');
	
	socket.on('playerData', function(data) {
		//console.log('playerData', data);
		//calculate player movement
		if (!(data.dir.up && data.dir.down)) {
			if (data.dir.up) {
				data.y -= data.speed;
			} else if (data.dir.down) {
				data.y += data.speed;
			}
		}
		if (!(data.dir.left && data.dir.right)) {
			if (data.dir.left) {
				data.x -= data.speed;
			} else if (data.dir.right) {
				data.x += data.speed;
			}
		}
		
		socket.emit('movePlayer', {x: data.x, y: data.y});
	});
	
	socket.on('joinGame', function(player) {
		socket.broadcast.emit('addPlayer', player);
	});
});