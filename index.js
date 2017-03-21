var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var theRoom = 'some-room';
var defaultNsps = '/';
var users = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  io.emit('chat message', "welcome:" + socket.id);

  console.log('user '+ socket.id +' connected');
  console.log('room: '+ socket.rooms);
	users[socket.id] = {};

  console.log(io.nsps[defaultNsps].adapter.rooms);

  console.log('USERS:', users, users.length);


	socket.on('login', function(name) {
    users[socket.id].name = name;
    io.emit('chat message', 'login:' + name);
  });

	socket.on('join', function(room) {
    users[socket.id].room = room;
    socket.join(room);
    io.emit('chat message', 'join:@'+ room);
  });

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
