var socket = io();

socket.emit('weat',1);
socket.on('weather',function (obj) {
    console.log(obj);
    weat_press_update(obj.temp,obj.press);
})
socket.on('msg',function (msg) {
    new_msg(msg);
});
socket.on('play',function (link) {
    change(link);
    console.log(link);
});
socket.on('alarmplay',function (link) {
    alarm(link);
    console.log(link);
});
socket.on('shad',function (val) {
    set_shad(val);
});
socket.on('cmd',function (cmd) {
    if(cmd=='обнови') window.location.reload();
});

socket.on('timetable',function (obj) {
    console.log(obj);
    let ttable ='';
    for (let i = 0; i < obj.length; i++) {
        ttable = ttable + '['+obj[i].start.substring(0,5)+'] ['+obj[i].audience+'] '+ obj[i].subject.substring(0,12)+' ['+obj[i].type+']\n';
    }
    console.log(ttable);
    timetable_update(ttable);
}) //Получили расписание

setInterval(function () {
    socket.emit('weat',1);
    console.log('Weather update');
},1000*60*15); //Запрос погоды каждые полчаса