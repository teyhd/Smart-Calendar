var app = require('express')();
var request = require('request');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let port = 80;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/css/:fileCss', function (req,res) {
    console.log(req.params.fileCss);
    res.sendFile(__dirname +'/css/'+ req.params.fileCss);
});

app.get('/codes/:fileJs', function (req,res) {
    console.log(req.params.fileCss);
    res.sendFile(__dirname +'/codes/'+ req.params.fileJs);
});

app.get('/img/:fileIMG', function (req,res) {
    console.log(req.params.fileIMG);
    res.sendFile(__dirname +'/img/'+ req.params.fileIMG);
});

app.get('/node_modules/*', function (req,res) {
    //console.log(req);
    res.sendFile(__dirname + req.path);
});

app.get('/msg*', function (req,res) {
    console.log(req.query);
    res.send("OK");
    io.emit('msg',req.query.text);
});

app.get('/play*', function (req,res) {
    console.log(req.query);
    res.send("OK");
    io.emit('play',req.query.link);
});

io.on('connection', function(socket){
    console.log('['+socket.id+'] user connected');
    socket.on('weat',function () {
        console.log(56);
        request.post({url:'http://ser.teyhd.ru/vkbot/smind/weather.php', form: {q:'88'}}, function(err,httpResponse,body){
            // console.log(httpResponse);
            console.log(body);
            var obj = JSON.parse(body);
            setTimeout(function () {
                socket.emit('weather',obj);
            }),3000
        })
    })
});

http.listen(port, function(){
    console.log('listening on *: '+port);
});




