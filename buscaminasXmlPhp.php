<?php

//if ( isset($_GET['nombre']) && isset($_GET['score']) && isset($_GET['dificultad']) ) {

	//si existe peticion recogemos los valores 
	$nombre = strtoupper($_GET['nombre']);
	$score = $_GET['score'];
	$dificultad = $_GET['dificultad'];
	$time = $_GET['time'];

	$con = new PDO('mysql:host=localhost;dbname=test', 'root', '');
	//1. se inserta el nuevo record la base de datos TOPFIVE
	$insert = "INSERT INTO RECORD ( NAME, SCORE, DEGREE, TIEMPO ) VALUES ( '".$nombre."', ".$score.", ".$dificultad.", ".$time." )";

	$rs = $con->prepare($insert);
	$rs->execute();

	//2. se consulta la puntuación, se genera el xml y se envía

	header('Content-type:text/xml');
	$xml = '<?xml version="1.0" encoding="UTF-8"?>';
	$xml .= "<records>";

	$con = new PDO('mysql:host=localhost;dbname=test', 'root', '');

    //si indicamos el orden
    if(isset($_GET['orden'])) {
    $order = strtoupper($_GET['orden']);
    } else {
    $order = "SCORE DESC";
    }
    
    $select = "SELECT * FROM RECORD ORDER BY ".$order." LIMIT 5 ";
	$rows = $con->prepare($select);
	$rows->execute();

		while ( $row = $rows->fetch() ) 
		{	
			$name = $row['NAME'];
			$score = $row['SCORE'];
			$degree = $row['DEGREE'];
			$tiempo = $row['TIEMPO'];

			$xml .= "<record>";
				$xml .= "<name>".$name."</name>";
				$xml .= "<score>".$score."</score>";
				$xml .= "<degree>".$degree."</degree>";
				$xml .= "<time>".$tiempo."</time>";
			$xml .= "</record>";
		}

	$xml .= "</records>";


	echo $xml;
//}



?>