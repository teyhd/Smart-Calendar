let main_div = $('#pic');
let time_div = $('.time');
let div_date = $('.date');
let week = $('.week');
let weat = $('.weather');
let press = $('.press');
let msg_div = $('.msg_div'); // Сообщение
let msg_txt = $('.msg_sp'); //Текст сообщения
let shadow = $('.shad');

var canvas = document.getElementById('canv');
var ctx = canvas.getContext('2d');

function init_content() {
    main_div.css({
        backgroundColor: "black",
        position: "absolute",
        left: "0px",
        top: "0px",
        width: $(window).width(),
        height: $(window).height()
    });
    time_div.css({
        left: (147/1920)*$(window).width(),
        top: (149/1080)*$(window).height()
    });
    msg_div.hide();
    set_shad(0);
    //change('glados/wakeup01.mp3');
} //Настройка расположения
function time_update() {
    let N_Date = new Date;
    let hour=(N_Date.getHours()<10)?'0'+N_Date.getHours():N_Date.getHours();
    let min=(N_Date.getMinutes()<10)?'0'+N_Date.getMinutes():N_Date.getMinutes();
    let sec=(N_Date.getSeconds()<10)?'0'+N_Date.getSeconds():N_Date.getSeconds();
    draw(N_Date.getHours(),N_Date.getMinutes(),N_Date.getSeconds());
    time_div.text(hour +':'+ min +':'+ sec); //Обновление времени
} // Обновление времени
function date_update() {
    let N_Date = new Date;
    var month=new Array(12);
    month[0]="Января";
    month[1]="Февраля";
    month[2]="Марта";
    month[3]="Апреля";
    month[4]="Мая";
    month[5]="Июня";
    month[6]="Июля";
    month[7]="Августа";
    month[8]="Сентября";
    month[9]="Октября";
    month[10]="Ноября";
    month[11]="Декабря";
    div_date.text(N_Date.getDate()+' '+month[N_Date.getMonth()]);
} //Дня
function week_update() {
    let N_Date = new Date;
    var weekday=new Array(7);
    weekday[0]="Воскресенье";
    weekday[1]="Понедельник";
    weekday[2]="Вторник";
    weekday[3]="Среда";
    weekday[4]="Четверг";
    weekday[5]="Пятница";
    weekday[6]="Суббота";
    week.text(weekday[N_Date.getDay()]);
} //Недели
function weat_press_update(we,pr) {
    weat.html(we + '&deg');
    press.text(pr);
} //Обновление Погоды и давления
function control(){
    let N_Date = new Date;
    time_update();
    if ((N_Date.getMinutes()==0)&&(N_Date.getSeconds()==0)){
        date_update();
        week_update();
    }
    if ((N_Date.getHours()>1) && (N_Date.getHours()<6)){
        set_shad(3);
    }
    if(N_Date.getHours()==7) set_shad(0);
} //События по времени
function new_msg(msg){
    msg_txt.text(msg);
    msg_div.show();
    setTimeout(function () {
        msg_div.hide();
    },10000)
} // Показ сообщения 10 секунд
function draw(h,m,s){
    ctx.clearRect(0,0,1920,1080);
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(177, 141, 128, 0,  get_rad(h*360/24), false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(534, 141, 128, 0,  get_rad(m*360/60), false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(891, 141, 128, 0,  get_rad(s*360/60), false);
    ctx.fill();
} //Рисуем круги
function get_rad(ang){
    return (ang*Math.PI)/180;
} //Радиан из угла
function set_shad(val){
    if (val!=0){
        if (val==1) val=0.2;
        if (val==2) val=0.7;
        if (val==3) val=0.9;
    }
    shadow.css({opacity:val});
} //Включить затемнение экрана
function change(link) {
    var player = document.getElementById("music");
    player.src = 'https://teyhd.ru/vkbot/bot/music/' + link;
    if (link === "Тишина") {
        player.stop();
    }
    setTimeout(function () {
        player.play()
    },1200);
} //Поставить трек

$( document ).ready(function () {
    init_content();
    $( window ).resize(function() {
        init_content();
    });// Изменили размер страницы

    time_update();
    date_update();
    week_update();
    weat_press_update(5,2);
    setInterval(control,1000);
    new_msg('Календарь запущен');
    draw(12,30,1);
});//Как только документ загрузился
