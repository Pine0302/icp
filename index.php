<?php

//exec('sudo /usr/bin/play /root/default.mp3');

   $command = "sox /root/default.mp3";
 	$result = system($command,$error);
 	var_dump($error);
echo phpinfo();