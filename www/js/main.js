function Game(canvasID, w, h, socket) {
	this.players = [];
	this.currentPlayer;
	this.width = w;
	this.height = h;
	this.$canvas = $(canvasID);
	this.$canvas.css('width', w);
	this.$canvas.css('height', h);
	this.c = this.$canvas.get(0).getContext('2d'); //get(0) because it's a jquery element
	this.socket = socket;
	
	var t = this;
	/*(function animLoop() {
		requestAnimationFrame(animLoop);
		t.gameLoop();
	})();*/
	setInterval(function() {
		t.gameLoop();
	}, 20);
}

Game.prototype = {
	gameLoop: function() {
		this.sendPlayerData();
		this.clear();
		this.update();
	},
	
	clear: function() {
		this.c.clearRect(0, 0, this.width, this.height);
	},
	
	update: function() {
		this.players.forEach(function(p) {
			p.draw();
		});
		if (this.currentPlayer != undefined) {
			this.currentPlayer.draw();
		}
	},
	
	addPlayer: function(x, y, id, isCurrent) {
		var p = new Player(this.c, x, y, id, isCurrent);
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

function Player(c, x, y, id, isCurrent) {
	this.c = c;
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
		this.draw();
	},
	
	draw: function() {
		this.c.fillStyle = "red";
		this.c.fillRect(this.x, this.y, 10, 10);
	},
	
	getData: function() {
		//console.log('dir', this.dir);
		return {x: this.x, y: this.y, dir: this.dir, speed: this.speed};
	},
	
	moveTo: function(x, y) {
		this.x = x;
		this.y = y;
		console.log('move to %d, %d', x, y);
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