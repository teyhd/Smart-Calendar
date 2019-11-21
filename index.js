var app        = require('express')();
var request    = require('request');
var http       = require('http').createServer(app);
var io         = require('socket.io')(http);
const fs       = require('fs');
var dateTime   = require('node-datetime');
var mysql      = require('mysql');

let port = 808;
const dir = './alarms';
var dt = dateTime.create();
var alarm_time = "18:45:30";
/*var connection = mysql.createConnection({
    host     : '95.104.192.212',
    user     : 'vlad',
    password : 'pXYMvrx8xILHDPxd',
    database : 'raspisanie'
});*/

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
}); // Цепляем главную страницу
app.get('/css/:fileCss', function (req,res) {
    console.log(req.params.fileCss);
    res.sendFile(__dirname +'/css/'+ req.params.fileCss);
}); //Цепляем css файлы
app.get('/codes/:fileJs', function (req,res) {
    console.log(req.params.fileCss);
    res.sendFile(__dirname +'/codes/'+ req.params.fileJs);
}); //Цепляем js
app.get('/img/:fileIMG', function (req,res) {
    console.log(req.params.fileIMG);
    res.sendFile(__dirname +'/img/'+ req.params.fileIMG);
}); //Цепляем картинки
app.get('/node_modules/*', function (req,res) {
    //console.log(req);
    res.sendFile(__dirname + req.path);
}); //Цепляем необходимые модули
app.get('/msg*', function (req,res) {
    console.log(req.query);
    res.send("OK");
    io.emit('msg',req.query.text);
}); // Выводим сообщение, полученное с get запроса
app.get('/play*', function (req,res) {
    console.log(req.query);
    res.send("OK");
    io.emit('play',req.query.link);
}); //Ставим музыку, полученную с get запроса
app.get('/shad*', function (req,res) {
    console.log(req.query);
    res.send("OK");
    io.emit('shad',req.query.shad);
}); //Устанавливаем тень, полученную с get запроса
app.get('/cmd*', function (req,res) {
    console.log(req.query);
    res.send("OK");
    switch (req.query.cmd) {
        case "testalrm":
            start_alarm();
            break;
        default:
            io.emit('cmd',req.query.cmd);
            break;
    }
}); //Устанавливаем тень, полученную с get запроса
io.on('connection', function(socket){
    console.log('['+socket.id+'] user connected');
    socket.on('weat',function () {
        send_weather(socket);
    });
}); //Открывающему соединение, отправляем погоду
http.listen(port, function(){
    console.log('Запущен сервер на порту: '+port);
}); //Открываем сервер
function send_weather(socket) {
        request.post({url:'http://localhost/weather.php', form: {q:'88'}}, function(err,httpResponse,body){
            console.log(body);
            if(body!=undefined){
            var obj = JSON.parse(body);
            setTimeout(function () {
                socket.emit('weather',obj);
            }),3000
            }
        })
} // Узнал погоду, вывел
/*function alarm_update(){
    try {
        connection.connect();
        connection.query("SELECT timeStart,subgroup FROM `timetable` WHERE `class`='АИСТбд-21' AND `date`='2019-11-19'", function (error, results, fields) {
            if (error) console.log(error);
            console.log('Подгруппа: '+ results[0].subgroup);
            if (results[0].subgroup==1){
                alarm_time = results[0].timeStart;
                console.log('Начало пары: ' + alarm_time);
                normal_alarm(45);
                io.emit('msg','Начало пары: ' + alarm_time);
            }
        });
        connection.end();
    } catch(e) {
        alert('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack); // (3) <--
    }
}*/ //!Обновление времени подъема средствами MYSQL NODEJS - (ЖРЕТ ПАМЯТЬ НЕ РАБОТАЕТ)
function normal_alarm(min) {
    let temp = alarm_time;
    let arr = temp.split(':');
    arr[1] = arr[1]-min;
    if (arr[1]<0){
        arr[1] = 60 + arr[1];
        arr[0]--;
    }
    if ((arr[0]<10) && (arr[0]!=0)) arr[0] = '0' + arr[0];
    if ((arr[1]<10) && (arr[1]!=0)) arr[1] = '0' + arr[1];
    if ((arr[2]<10) && (arr[2]!=0)) arr[2] = '0' + arr[2];
    alarm_time = arr[0] +':'+ arr[1] +':'+ arr[2];
    console.log('Вставать в '+alarm_time);
} //Отнять минуты от времени
function alarm_time_u(){
    //request.post({url:'https://teyhd.ru/cloud/data/User/admin/home/test.php', form: {q:'88'}}, function(err,httpResponse,body){
    request.post({url:'http://localhost/test.php', form: {q:'88'}}, function(err,httpResponse,body){
        if(body!=undefined){
            var obj = JSON.parse(body);
            alarm_time = obj[0].start;
            console.log('Начало пары: ' + alarm_time);
            normal_alarm(45);
            io.emit('msg','Начало пары: ' + alarm_time);
        }
    })
} // Обновление начала пары из php на ТЕКУЩИЙ день
alarm_time_u();
function start_alarm() {
    fs.readdir(dir, (err, files) => {
        singrand = Math.floor(Math.random() * Math.floor(files.length));
        io.emit('msg','Доброе утро!!!');
        io.emit('alarmplay',files[singrand]);
        console.log('БУДИЛЬНИК');
    });
} // Будильник
var singrand; //Выбор рандомного трека
setInterval(function() {
    dt = dateTime.create();
    if ((dt.format('H')>="00")&&(dt.format('H')<="12"))
         if (dt.format('M:S')== "00:00") alarm_time_u(); //Обновлять каждый час, но ночю
    if ((dt.format('H:M:S')== alarm_time)||(dt.format('M:S')== "20:20")){
        start_alarm();
    }
}, 1000); //Таймер событий