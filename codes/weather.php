<?PHP
echo 5;

function weather($user_id){
           $time = time() + (7 * 24 * 60 * 60);
           $username = usrname($user_id,'get',1);
           $url = "https://api.darksky.net/forecast/a251147ccfb4e5c7ecc5f91e54598f8b/54.3711173,48.5828901,{$time}?lang=ru&units=si";
            $ch = curl_init();
            curl_setopt($ch,CURLOPT_URL,$url);
            curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
            curl_setopt($ch,CURLOPT_CONNECTTIMEOUT, 4);
            $json = curl_exec($ch);
            if(!$json) {
                echo curl_error($ch);
            }
            curl_close($ch);
            $json = json_decode($json);
            $arr = $json->currently;

            $outwindow = $arr->summary;

            $temp = $arr->temperature;
            $temp = round($temp);

            $wind = $arr->windSpeed;
            $wind = round($wind);

            $press = $arr->pressure;
            $press = round($press/1.333);

            $now =  $json->hourly;
            $now = $now->summary;

            $daily = $json->daily;
            $daily=object2array($daily);
            $daily=$daily['data'];
            $daily=$daily[0];

            $vosxod=$daily['sunriseTime'];
            $vosxod=date("H:i:s",$vosxod);

            $zakat=$daily['sunsetTime'];
            $zakat=date("H:i:s",$zakat);

            $moon=$daily['moonPhase'];
            if($moon==0) $moon="Новолуние";
            if(($moon>0)&&($moon<0.25)) $moon="Растущий полумесяц";
            if($moon==0.25) $moon="Первая четверть луны";
            if(($moon>0.25)&&($moon<0.5)) $moon="Растущая луна";
            if($moon==0.5) $moon="Полнолуние";
            if(($moon>0.5)&&($moon<0.75)) $moon="Убывающая луна";
            if($moon==0.75) $moon="Последняя четверть луны";
            if($moon>0.75) $moon="Убывающий полумесяц";

            $msg = "{$username}, сейчас за окном: {$outwindow}. Температура воздуха: {$temp} градусов Цельсия. Ветер {$wind} метров в секунду. Давление {$press} миллиметров ртутного столба. {$now} {$moon}. Восход: {$vosxod}. Закат: {$zakat}.";
            return $msg;
}

function weather1(){
$url = "https://api.darksky.net/forecast/a251147ccfb4e5c7ecc5f91e54598f8b/54.3711173,48.5828901?exclude=minutely,flags,hourly,daily,alerts?temperature?summary?auto";
$ch = curl_init();
curl_setopt($ch,CURLOPT_URL,$url);
curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch,CURLOPT_CONNECTTIMEOUT, 4);
$json = curl_exec($ch);
if(!$json) {
    echo curl_error($ch);
}
curl_close($ch);
$json = json_decode($json);
$arr = $json->currently;
$temp = $arr->temperature;
$temp = round(($temp - 32) *  5/9);
echo "$temp";
}

$q = $_REQUEST["q"];
$hint = "";
// lookup all hints from array if $q is different from ""
if ($q !== "") {
 weather();
} else{
	echo $hint === "" ? "no suggestion" : $hint;
}

?>