var WIDTH = 480;
var HEIGHT = 270;

var player;
var socket = io();
var gameArea = new GameArea(WIDTH, HEIGHT, socket);

socket.on('addPlayers', function(players) {
	players.forEach(function(player) {
		gameArea.addPlayer(player.x, player.y, player.id, false);
	});
});

socket.on('playerData', function(data) {
	//contains data for all the players
	gameArea.receivePlayerData(data);
});

socket.on('movePlayer', function(data) {
	//move current player
	gameArea.currentPlayer.moveTo(data.x, data.y);
});

$(document).ready(function() {
	startGame();
});

function startGame() {
	gameArea.start();
	joinGame();
	//player = new Player(30, 30, '#90C3D4', 10, 120);
}

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
	gameArea.addPlayer(x, y, id, true);
	console.log('my id: ', id);
	socket.emit('joinGame', {x: x, y: y, id: id});
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max-min+1) + min);
}