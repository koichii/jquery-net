var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// テンプレートエンジンを EJS に設定
app.set('views', './views');
app.set('view engine', 'ejs');

var	rooms = {demo: true};

app.get('/', function(req, res){
  //res.sendFile(__dirname + '/index.html');
  res.render('index');
});

app.get('/client', function(req, res){
  res.sendFile(__dirname + '/views/client.html');
/*
	var name = req.query.name;
	var room = req.query.room;
  console.log('name: '+ name);
  console.log('room: '+ room);
  res.render('client', { name: name, room: room });
*/
});

app.get('/admin', function(req, res){
  res.render('admin');
});

io.on('connection', function(socket){
  // connected
  socket.emit('connected', socket.id);
  console.log('connected', socket.id);

  // join the room
  function joinRoom(room){
    socket.join(room);
    socket.emit('joind', room);
    console.log('joind', room);
    //console.log(io.nsps["/"].adapter.rooms);
  }
  // client trys to join the room
	socket.on('join', function(room) {
		if ( rooms[room] ) {
      joinRoom(room);
    } else {
      console.log('Cannot join:', room);
		}
  });
  // admin trys to create the room
  socket.on('admin-createRoom', function(room) {
  	if ( rooms[room] ) {
      console.log('Cannot creates:', room);
    } else {
      rooms[room] = {socket: socket};
      console.log('createed:', room);
      joinRoom(room);
  	}
  });
  // script recive and send {from:, to:, script}
  socket.on('script', function(s) {
    io.to(s.to).emit('script', s);
    console.log('script:', s);
  });
  // disconnected
  socket.on('disconnect', function(){
    console.log('user '+ socket.id +' disconnected');
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
