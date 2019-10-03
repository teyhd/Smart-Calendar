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
socket.on('shad',function (val) {
    set_shad(val);
})

setInterval(function () {
    socket.emit('weat',1);
    console.log('Weather update');
},1000*60*30); //Запрос погоды каждые полчаса