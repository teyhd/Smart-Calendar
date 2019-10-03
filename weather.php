<?php

function object2array($object) { return @json_decode(@json_encode($object),1); }

function weather(){
           $time = time() + (7 * 24 * 60 * 60);
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
            
            $arr = array();
            $arr['temp'] = $temp;
            $arr['press'] = $press;
            echo(json_encode($arr));
}

weather();

?>