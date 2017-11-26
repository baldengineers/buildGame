var express = require('express');
var app = express();

//resources server
app.use(express.static(__dirname + '/www'));

var server = app.listen(process.env.PORT || 1266, function() {
	var port = server.address().port;
	console.log('Server running on port %s', port);
});

var io = require('socket.io')(server);

io.on('connection', function(client) {
	console.log('user connected');
	
});