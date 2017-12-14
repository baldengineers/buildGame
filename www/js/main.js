function GameArea(width, height, $div, socket) {
	this.width = width;
	this.height = height;
	this.canvas = document.createElement('canvas');
	this.$div = $div;
	this.players = [];
	this.currentPlayer;
	this.socket = socket;
}

GameArea.prototype = { 
	start: function() {
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.context = this.canvas.getContext('2d');
		this.$div.append(this.canvas);
		//document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.setControls();
		
		var t = this;
		setInterval(function() {
			t.updateGameArea();
		}, 20);
	},
	
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	
	updateGameArea: function() {
		this.movePlayer();
		this.sendCurPlayerData();
		
		this.sync();
		
		//clear the screen
		this.clear();
		
		//update players
		this.players.forEach(function(p) {
			p.update();
		});
		if (this.currentPlayer != undefined) {
			this.currentPlayer.update();
		}
	},
	
	movePlayer: function() {
		//calculate player movement
		if (this.currentPlayer != undefined) {
			var p = this.currentPlayer;
		
			if (!(p.dir.up && p.dir.down)) {
				if (p.dir.up) {
					p.y -= p.speed;
				} else if (p.dir.down) {
					p.y += p.speed;
				}
			}
			if (!(p.dir.left && p.dir.right)) {
				if (p.dir.left) {
					p.x -= p.speed;
				} else if (p.dir.right) {
					p.x += p.speed;
				}
			}
		
		}
		
		this.players.forEach(function(player) {
			var p = player;
		
			if (!(p.dir.up && p.dir.down)) {
				if (p.dir.up) {
					p.y -= p.speed;
				} else if (p.dir.down) {
					p.y += p.speed;
				}
			}
			if (!(p.dir.left && p.dir.right)) {
				if (p.dir.left) {
					p.x -= p.speed;
				} else if (p.dir.right) {
					p.x += p.speed;
				}
			}
		});
	},
	
	addPlayer: function(x, y, id, isCurrent) {
		//console.log('players before: ', this.players);
		var p = new Player(this.context, x, y, id, isCurrent);
		if (p.isCurrent) {
			this.currentPlayer = p;
			//console.log('currentplayer', this.currentPlayer);
		} else {
			this.players.push(p);
			//console.log('add player with id of: ' + id);
		}
		//console.log('players after: ', this.players);
	},
	
	rmPlayer: function(id) {
		for (var i = this.players.length-1; i >= 0; i--) {
			if (this.players[i].id == id) {
				this.players.splice(i, 1);
			}
		}
	},
	
	sync: function() {
		this.socket.emit('sync');
	},
	
	sendCurPlayerData: function() {
		if (this.currentPlayer != undefined) {
			var data = this.currentPlayer.getData();
			//console.log(data);
			this.socket.emit('movePlayer', data);
		}
	},
	
	receivePlayerData: function(data) {
		//receive positions of all the players. Data is [{id: id, x: x, y: y}]
		//console.log(this.players);
		
		data.forEach(function(item) {
			//console.log('item id ', item.id);
			//console.log(this.players);
			if (this.players != undefined) {
				this.players.forEach(function(player) {
					//console.log('player id ', player.id);
					if (item.id == player.id) {
						//console.log('setting player dir to ', item.dir);
						player.dir = item.dir;
						player.speed = item.speed;
						player.moveTo(item.x, item.y);
					}
				});
			}
		}, this); //without this "this" all the this. variables are undefined!
	},
	
	setControls: function() {
		var t = this;
		$(document).keydown(function(e) {
			var k = e.keyCode || e.which;
			switch(k) {
				case 87:
					//w
					t.currentPlayer.dir.up = true;
					break;
				case 68:
					//d
					t.currentPlayer.dir.right = true;
					break;
				case 83:
					//s
					t.currentPlayer.dir.down = true;
					break;
				case 65:
					//a
					t.currentPlayer.dir.left = true;
					break;
			}
		}).keyup(function(e) {
			var k = e.keyCode || e.which;
			switch(k) {
				case 87:
					//w
					t.currentPlayer.dir.up = false;
					break;
				case 68:
					//d
					t.currentPlayer.dir.right = false;
					break;
				case 83:
					//s
					t.currentPlayer.dir.down = false;
					break;
				case 65:
					//a
					t.currentPlayer.dir.left = false;
					break;
			}
		});
		
		$(window).blur(function() {
			t.currentPlayer.dir = {up: false, right: false, down: false, left: false};
		});
	}
}

function Player(context, x, y, id, isCurrent) {
	this.x = x;
	this.y = y;
	this.color = 'red';
	this.ctx = context;
	this.id = id;
	this.isCurrent = isCurrent; //is it the current player
	this.dir = {up: false, right: false, down: false, left: false};
	this.speed = 5;
	this.init();
}

Player.prototype = {
	init: function() {
		this.update();
	},
	
	update: function() {
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.x, this.y, 30, 30);
	},
	
	getData: function() {
		//console.log('dir', this.dir);
		return {x: this.x, y: this.y, dir: this.dir, speed: this.speed, id: this.id};
	},
	
	moveTo: function(x, y) {
		this.x = x;
		this.y = y;
		//console.log('move to %d, %d', x, y);
	},
}