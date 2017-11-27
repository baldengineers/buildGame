var WIDTH = 500;
var HEIGHT = 500;

var socket = io(); //.connect('http://localhost');
var game = new Game('#canvas', WIDTH, HEIGHT, socket);

socket.on('addPlayer', function(player) {
	var p = new Player(player.x, player.y, player.id, false);
	game.addPlayer(p);
});

socket.on('movePlayer', function(pos) {
	game.currentPlayer.moveTo(pos.x, pos.y);
});

$(document).ready(function() {
	joinGame();
});

$(window).on('beforeunload', function() {
	socket.emit('leaveGame');
});

function joinGame() {
	function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	}
	
	var x = randInt(100, WIDTH-100);
	var y = randInt(100, HEIGHT-100);
	
	var id = guid();
	var player = new Player(x, y, id, true);
	game.addPlayer(player);
	socket.emit('joinGame', player);
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max-min+1) + min);
}