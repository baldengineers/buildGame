function Game(canvasID, w, h, socket) {
	this.players = [];
	this.currentPlayer;
	this.width = w;
	this.height = h;
	this.$canvas = $(canvasID);
	this.$canvas.css('width', w);
	this.$canvas.css('height', h);
	this.socket = socket;
	
	var t = this;
	(function animLoop() {
		requestAnimationFrame(animLoop);
		t.gameLoop();
	})();
}

Game.prototype = {
	gameLoop: function() {
		this.sendPlayerData();
	},
	
	addPlayer: function(p) {
		if (p.isCurrent) {
			this.currentPlayer = p;
			console.log('currentplayer', this.currentPlayer);
		} else {
			this.players.push(p);
		}
	},
	
	sendPlayerData: function() {
		if (this.currentPlayer != undefined) {
			var data = this.currentPlayer.getData();
			this.socket.emit('playerData', data);
		}
	}
}

function Player(x, y, id, isCurrent) {
	this.x = x;
	this.y = y;
	this.id = id;
	this.isCurrent = isCurrent; //is it the current player
	this.dir = {up: false, right: false, down: false, left: false};
	this.speed = 5;
	this.init();
}

Player.prototype = {
	
	init: function() {
		this.setControls();
	},
	
	getData: function() {
		//console.log('dir', this.dir);
		return {x: this.x, y: this.y, dir: this.dir, speed: this.speed};
	},
	
	moveTo: function(x, y) {
		this.x = x;
		this.y = y;
		//console.log('move to %d, %d', x, y);
	},
	
	setControls: function() {
		var t = this;
		$(document).keydown(function(e) {
			var k = e.keyCode || e.which;
			switch(k) {
				case 87:
					//w
					t.dir.up = true;
					break;
				case 68:
					//d
					t.dir.right = true;
					break;
				case 83:
					//s
					t.dir.down = true;
					break;
				case 65:
					//a
					t.dir.left = true;
					break;
			}
		}).keyup(function(e) {
			var k = e.keyCode || e.which;
			switch(k) {
				case 87:
					//w
					t.dir.up = false;
					break;
				case 68:
					//d
					t.dir.right = false;
					break;
				case 83:
					//s
					t.dir.down = false;
					break;
				case 65:
					//a
					t.dir.left = false;
					break;
			}
		});
	}
	
}