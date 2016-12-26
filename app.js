var room=require('./xmax/chatRoom');
var express=require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
room.init(http);
//console.log(room);

var virtualPath = process.env.virtualPath || "";
var port = process.env.PORT || 3000;
app.use(virtualPath,express.static(path.join(__dirname, 'public')));
http.listen(port, function(){
    console.log('listening on *:3000');
});
app.get('/chat/', function(req, res){
    res.send('<h1>Welcome Realtime Server</h1>'+room.roomnumber);
});
app.get('/abc/', function(req, res){
    res.send('<h1>Welcome abc Server</h1>'+room.chatHistory);
});