var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// テンプレートエンジンを EJS に設定
app.set('views', './views');
app.set('view engine', 'ejs');

var theRoom = 'some-room';
var defaultNsps = '/';
var globalinfo;
var	users = [];
var	rooms = {};

app.get('/', function(req, res){
  //res.sendFile(__dirname + '/index.html');
  res.render('index', { name: "なまえ", rooms: rooms });
});

app.get('/client', function(req, res){
	var name = req.query.name;
	var room = req.query.room;
  console.log('name: '+ name);
  console.log('room: '+ room);
  res.render('client', { name: name, room: room });
});

io.on('connection', function(socket){

  io.emit('chat message', "welcome:" + socket.id);

  console.log('user '+ socket.id +' connected');
	users[socket.id] = {};

	socket.on('login', function(login) {
    var name = login.name || "unknown";
    var room = login.room || "default";
		var role = login.role || "guest";
    users[socket.id].name = login.name;
    users[socket.id].room = room;
    users[socket.id].role = role;
    socket.join(room);
		if (! rooms[room]) {
			rooms[room] = {id: socket.id, name: room};
		}
    io.emit('chat message', 'login:' + name);

		console.log('LOGIN:', users);
		console.log('ROOMS:', rooms);

  });
/*
	socket.on('join', function(room) {
    users[socket.id].room = room;
    socket.join(room);
    io.emit('chat message', 'join:@'+ room);
  });
*/
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  console.log('USERS:', users);
  });

  socket.on('script', function(s){
    io.emit('script', s);
  });

  socket.on('disconnect', function(){
    delete users[socket.id];
    console.log('user '+ socket.id +' disconnected');
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
