var WIDTH = 480;
var HEIGHT = 270;

var player;
var socket = io();
var $content = $('.content');
var $wrapper = $('.wrapper');
var gameArea = new GameArea(WIDTH, HEIGHT, $content, socket);

//socket stuff
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

socket.on('leaveGame', function(id) {
	//when an existing player leaves the gameArea
	gameArea.rmPlayer(id);
});

//joining game
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
	socket.emit('joinGame', {x: x, y: y, id: id});
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max-min+1) + min);
}

//resizing window
var contentH = gameArea.$content.outerHeight();
var contentW = gameArea.$content.outerWidth();

/*
$wrapper.resizeable({
	resize: doResize
});

function doResize(event, ui) {
	
	var scale = Math.min(ui.size.width / contentW, ui.size.height / contentH);
	
	$content.css({
		transform: 'translate(-50%, -50%) ' + 'scale(' + scale + ')'
	});
}
*/