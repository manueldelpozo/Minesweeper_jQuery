var score;
    var sec;
    var min;
    var tiempo;
    var crono;
    var boom;
    var nivel;
    var dimension;
    var numBombas;
    var numBanderas;
    var dim2;
    var fin;
    var orden;
    var matriz = new Array();

    function inicio(nivel) {
        //quitar botones de nivel
        $("p").hide();
        $("button.nivel").hide();
        //inicializar parametros
        score = 0;
        clearInterval(crono);
        sec = "00";
        min = "00";
        tiempo = 0;
        boom = false;
        numBombas = 0;
        numBanderas = 0;
        fin = false;
        //mostramos marcador tiempo y tablero
        $("span").show();
        $("div#score").text(score);
        $("div#time").text(sec);
        $("table#tablero").show();
        //iniciamos tiempo
        crono = setInterval( function() {
            $("div#time").text(min+":"+sec);
            sec++;
            tiempo++;
            if(sec<10)
                sec= "0"+sec;
            if(sec>59) {
                sec="00";
                min++;
                if(min<10)
                    min= "0"+min;
            }
        }, 1000)
        //si fin de partida
        //if( boom || fin ){
            //ocultar input para guardar y resetearlo
            $("div.fin").hide();
            $("input#nombre").val("");
            //borrar, has ganado o has perdido
            $("div#win").empty();
            //y borrar tabla de records y ocultar
            $("table#records").empty();
            $("table#records").hide();
            //retornar el color a la tabla
            $("table#tablero").css("background-color","brown");
        //}
        //cambiar aspecto del boton start aunque no fin
        $("button#start").empty();
        $("button#start").text("Start!").css("color","black");
        //si hemos introducido los datos a través del input
        if(!nivel) {
            //quitar botones de nivel si no se han activado antes
            $("p").hide();
            $(".nivel").hide();
        } else { //si hemos introducido los datos a traves de ls niveles
            filas = nivel;  
            columnas = filas;
            
        } 
        //captura de valores
        if( $("input#dimension").val() ) {
            filas = $("input#dimension").val();
            columnas = filas; 
        } else if( $("input#filas").val() && $("input#filas").val() )  {
            filas = $("input#filas").val();
            columnas = $("input#columnas").val();
        } 
        
        dimension = filas*columnas;
        construirTablero(filas,columnas);
        
    }

    //BOTONES
     
    $("span#dim2").click( function() {
        if( $("input#dimension").length ) {
            $("input#dimension").replaceWith( "<input type='number' id='filas'/><input type='number' id='columnas'/>" );
            $("input#filas").attr("placeholder","filas").attr("size","6").attr("step","2");
            $("input#columnas").attr("placeholder","columnas").attr("size","6").attr("step","2");
            //cambia el contenido del span
            $(this).text("...¿prefieres introducir dimensión?");
            dim2 = true;
        }else { //volver al estado inicial
            $("input#filas").replaceWith( "<input type='number' id='dimension' placeholder='dimensión' step='2'/>" );
            $("input#columnas").remove();
            //cambia el contenido del span
            $(this).text("...¿prefieres introducir filas y columnas?");
            dim2 = false;
        }
    });

    $("button#start").click( function() {
        if( dim2 ) {// caso input filas y columnas
            if( !$("input#filas").val() && !$("input#columnas").val() || isNaN($("input#filas").val()) || isNaN($("input#columnas").val()) || $("input#filas").val()<=0 || $("input#columnas").val()<=0 )
                alert("Por favor, introduce el NÚMERO de filas y columnas o selecciona un nivel de dificultad");
            else
                inicio(nivel);
        } else {//caso input dimension
            if( !$("input#dimension").val() || isNaN($("input#dimension").val()) || $("input#dimension").val()<=0  )
                alert("Por favor, introduce el NÚMERO de dimesión (ej. 3 -> 3x3) o selecciona un nivel de dificultad");
            else
                inicio(nivel);
        }
    });

    $("button#facil").click( function() {
        nivel=5;
        inicio(nivel);
    });

    $("button#medio").click( function() {
        nivel=8;
        inicio(nivel);
    });

    $("button#dificil").click( function() {
        nivel=12;
        inicio(nivel);
    });

    $("button#guardar").click( function() {
        guardarPartida();
    });


    function construirTablero(filas,columnas) {
        
        //destruir tabla si esta construida
        if($("table#tablero").children()) {
            $("table#tablero").empty();
        }
        
        //construir tabla

        //filas
        for (var i = 0; i < filas; i++) {
            $("table#tablero").append("<tr></tr>");
            //matriz
            matriz[i] = new Array();
            //columnas
            for (var j = 0; j < columnas; j++) {
                //añadir td
                $("table#tablero tr:last-child").append("<td class='casilla'></td>");
                //captar ultimo td
                var $td = $("table#tablero tr:last-child td:last-child");
                //su posicion
                var fila = i;
                var col = j;
                matriz[i][j] = new Array();
                //agregamos el div con la clase
                $td.append("<div class='cesped'></div>");
                var $div = $td.find("div.cesped");
                //almacenamos las variables en un objeto data del td
                $td.data("fila",fila); 
                $td.data("col",col); 
                //$td.data("posicion",fila+(dim*col)); 
                $td.data("imagen", $div );
                $td.data("bomba",false); //valor por defecto es falso 
                //colocamos el cesped a todas las casilla
                $div.addClass("cesped");
                //si no hemos encontrado bomba congelamos las funciones
                
                    $div.bind( {
                        contextmenu: function(e) { //boton derecho  
                            if( !boom ) {
                            if(!$(this).hasClass("bandera")) {
                                //si el click es context menu, mostrar bandera, quitamos la clase cesped
                                $(this).removeClass("cesped").addClass("bandera");
                                numBanderas++;
                            } else {
                                //si el click es context menu y ya hay bandera, quitar clase bandera                 
                                $(this).removeClass("bandera").addClass("cesped");
                                numBanderas--;
                            }
                            e.preventDefault(); //ocultar context menu 
                            }
                        },
                        dblclick: function() { //doble click
                            if( $(this).hasClass("numero") ) {
                                var f = $(this).parent("td").data("fila");
                                var c = $(this).parent("td").data("col");
                                expandir(f,c);
                            }
                        },
                        click: function() { //boton izq
                            if( !boom ) {
                            $(this).removeClass("cesped");//quitamos la clase cesped
                            //si hay bomba, la mostramos
                            if( $(this).parent("td").data("bomba") ) {
                                $(this).addClass("bomba");
                                //la señalamos en rojo
                                $(this).css("background-color","red");
                                //has perdido
                                $("div#win").text("¡HAS PERDIDO!");
                                $("div#win").css("color","red");
                                
                                //y congelamos el juego
                                explosion();
                            }
                            //si no hay bomba, mostramos numero
                            else {
                                var n = $(this).parent("td").data("num");
                                var f = $(this).parent("td").data("fila");
                                var c = $(this).parent("td").data("col");
                                if(!n==0) {
                                    $(this).parent("td").text(n);
                                } else {//si es cero lo dejamos en blanco
                                    $(this).parent("td").text("");
                                    //y expandimos
                                    expandir(f,c);
                                }
                                $(this).addClass("numero");
                                //y sumamos puntos
                                sumarScore(filas,columnas);
                            }
                            }
                        }
                    });  
                    //efecto al pasar por encima solo cuando hay clase cesped

                    $div.on("mouseenter", function() { 
                        if( $(this).hasClass("cesped") )
                            $(this).removeClass("cesped").addClass("topo");
                    });
                    $div.on("mouseleave", function() {     
                        if( $(this).hasClass("topo") )
                            $(this).removeClass("topo").addClass("cesped");
                    });

                
                
            };
           
        };
        animacionInicio()
        ponerBombas(filas,columnas);   
    }

    function animacionInicio() {
        $("td").each( function(){
            $(this).find("div.cesped")
            .animate(
                { opacity: "100", height: "30", width: "30"},
                200
            );
        });
    }

    function expandir(f,c) {
        $("td").each( function(){
            var f2 = $(this).data("fila");
            var c2 = $(this).data("col"); 
            if( f2==f-1 || f2==f+1 || f2==f ) {
                if( c2==c || c2==c-1 || c2==c+1 )
                    destapar($(this));
            }
        });
               
    }
    function destapar($alr) {
        var n = $alr.data("num");

        $alr.find("div.cesped").removeClass("cesped")
            .addClass("numero");
        if( n==0 ) { //repetimos el proceso si encontramos otro cero
            n="";
            $alr.text(n);
            //expandir( $alr.data("fila") , $alr.data("col") );
        } else {
            $alr.text(n);
        }    
    }
  
    function ponerBombas(filas,columnas) {
        // ponemos tantas bombas como filas hay     
        numBombas = columnas;
        for (var i = 0; i < numBombas; i++) {
            //elegimos una casilla al azar
            var bombaCol = Math.floor(Math.random()*columnas) ;
            var bombaFila = Math.floor(Math.random()*filas) ;

            var $casilla = $("td").eq( bombaCol + (filas*bombaFila) );

            $casilla.data("bomba", true );  

        }
        //una vez terminada la colocacion de bombas obtenemos las posiciones
        //si no hay mina le ponemos un 0
        $("td").each( function() {
            if( !$(this).data("bomba") ) {
                $(this).data("num", 0);
            }
        });
        numBombas = 0 //reseteamos el numBombas para saber cual es el valor real
        $("td").each( function() {
            if( $(this).data("bomba") ) {
                numBombas++;
                var filaB = $(this).data("fila");
                var colB = $(this).data("col");
                var posB = $(this).data("posicion");

                sumarNumeros(filaB,colB);
            }
        });
        
    }


    function sumarNumeros(bombaFila,bombaCol) {
        //recorremos todos los td y vamos haciendo preguntas
        $("td").each( function() {
            //obtenenmos su posicion
            var fila = $(this).data("fila");
            var col = $(this).data("col");
            //preguntamos si hay una bomba alrededor y sumamos en tal caso

            //S
            if((fila+1 == bombaFila) && (col == bombaCol))
               { $(this).data("num", $(this).data("num")+1 ); }
            //N
            if((fila-1 == bombaFila) && (col == bombaCol))
               { $(this).data("num", $(this).data("num")+1 );}
            //O
            if((col-1 == bombaCol) && (fila == bombaFila))
               { $(this).data("num", $(this).data("num")+1 );}
            //E
            if((col+1 == bombaCol) && (fila == bombaFila))
               { $(this).data("num", $(this).data("num")+1 );
                console.log("entra al este, fila="+fila+" columna="+col+" bombaFila="+bombaFila+" bombaCol="+bombaCol);}
            //NE
            if((fila+1 == bombaFila) && (col-1 == bombaCol))
               { $(this).data("num", $(this).data("num")+1 );}
            //NO
            if((fila-1 == bombaFila) && (col-1 == bombaCol))
               { $(this).data("num", $(this).data("num")+1 );}
            //SE
            if((fila+1 == bombaFila) && (col+1 == bombaCol))
               { $(this).data("num", $(this).data("num")+1 );}
            //SO
            if((fila-1 == bombaFila) && (col+1 == bombaCol))
               { $(this).data("num", $(this).data("num")+1 );}
        });
            
    }

    function sumarScore(filas,columnas) {
        score++;
        $("div#score").text(score);
        //si el score es igual a la dimension2 menos el numBombas
        if( score == filas*columnas - numBombas || numBombas == numBanderas ) {
            //has ganado
            $("div#win").text("¡HAS GANADO!");
            $("div#win").css("color","green");
            //guardar y comenzar
            explosion();
            $("table#tablero").css("background-color","green");
        }
    }
       
    function explosion() {
        //cambiamos el boton
        $("#start").empty();
        $("#start").text("Start again!").css("color","red");
        //congelamos el click de las casillas
        boom = true;
        //DESTAPAMOS TODAS LAS CASILLAS
        $("td").each( function(i) {
            if ( $(this).data("bomba") ) {
                $(this).find("div").removeClass();
                $(this).find("div").addClass("bomba");
            }
        });
        //paramos el tiempo
        clearInterval(crono);
        //mostramos registro de records
        $(".fin").show();
        fin = true;
    }
    

    function guardarPartida(orden) {
        
        var nombre = $("input#nombre").val();
        var score = $("div#score").text();
        var dificultad = dimension;
        var time = tiempo;
        var recurso;
        
        if(!orden) {
            recurso= "buscaminasXmlPhp.php?nombre="+nombre+"&score="+score+"&dificultad="+dificultad+"&time="+time;
        } else {
            recurso= "buscaminasXmlPhp.php?nombre="+nombre+"&score="+score+"&dificultad="+dificultad+"&time="+time+"&orden="+orden;
        }
        console.log(recurso);

        $.ajax({
            // la URL para la petición
            url : recurso,
         
            // especifica si será una petición POST o GET
            type : 'GET',
         
            // el tipo de información que se espera de respuesta
            dataType : 'xml',
         
            // código a ejecutar si la petición es satisfactoria;
            // la respuesta es pasada como argumento a la función
            success : function(xml) {

                //objetoDOM XML 
                var $records = $(xml).find( "records" ); //find nos devuelve un jquery con todos los elementos <record>
                //1._ocultamos la tabla y los botones de abajo
                $("table#tablero").hide();
                $("span").hide();
                $("div.fin").hide();
                //y reseteamos la tabla de records anterior
                $("table#records").empty();
                //2._mostramos la tabla records actual
                $("table#records").show();
                //encabezado
                $("table#records").append("<tr><td><button id='nameT'>NAME</button></td><td><button id='scoreT'>SCORE</button></td><td><button id='degreeT'>DEGREE</button></td><td><button id='timeT'>TIME(sec)</button></td></tr><hr/>");
                //3._recorremos los hijos del objeto DOM del xml y rellenamos la tabla de records
                $records.children().each( function(){ // al recorrer un objeto no necesitamos el item itm, leemos cada elemento con this
                    $("table#records").append("<tr></tr>");
                    $(this).children().each( function(){
                        $("table#records tr:last-child").append("<td class='puntos'>"+$(this).text()+"</td>");
                    });
                });                
            },
            // código a ejecutar si la petición falla;
            error : function(xhr, status) {
                alert('Disculpe, existió un problema');
            },
         
            // código a ejecutar sin importar si la petición falló o no
            complete : function(xhr, status) {
                alert('Petición realizada');
            }
        });
    }
        
    //botones para ordenar
    $("button#nameT").click( function() {
        guardarPartida("name");
    } );
    $("button#scoreT").click( function() {guardarPartida("score");} );
    $("button#degreeT").click( function() {guardarPartida("degree");} );
    $("button#timeT").click( function() {guardarPartida("tiempo");} );


      
