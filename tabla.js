var variables = ["p","t","q","t","r","t","s","t"]; //Variables a usarse
var verdades = [false,false,false,false]; //Por default verdades
var proposiciones = ["p","q","r","s"]; //Proposiciones totales
var finalStatement = "";
var tableStatement = "";
var tipo_tabla = new Array();
var proposicionesSimples = new Array(); //Proposiciones Simples
var array = new Array();
var answers = new Array(); //Respuestas
var ventana = null; //Ventana vacia
//cambiar valores de verdad
function switchValue(value){
    var rdnbutton = document.getElementsByName("valor");
    var textFields = document.getElementsByName("value");    
    for(var i=0; i<rdnbutton.length;i++){//Comprueba radiobutton
        if(rdnbutton[i].checked === true){
            textFields[i].value = value;//Se guarda el valor checkeado
            break;
        }
    }
       
    for(var k=0; k<variables.length; k++){
        if(variables[k]===(rdnbutton[i].value)){
            if(value==="true") variables[k+1] = "t";
            else variables[k+1] = "f";
        }
    } 
}

//retornar variable
function retornar(num,statement){
    var anterior=document.fo.valores.value;//obtiene lo que hay en el campo de texto de la calculadora
    document.getElementById("valores").value=anterior+num;//adiciona el elemento presionado
    finalStatement+=statement;
}

//eliminar ultimo valor DEL
function eliminar(){
    var anterior=document.fo.valores.value;
    var nuevovalor=anterior.substring(0,anterior.length-1);
    finalStatement = finalStatement.substring(0,finalStatement.length-1);
    document.getElementById("valores").value=nuevovalor;
}

//eliminartodo
function limpiarTextField(){
    document.fo.valores.value="";
    document.fo.resultado.value="";
    var texts = document.getElementsByName("value");
    for(var i = 0; i< texts.length ;i++){
        texts[i].value = "";
    }
    finalStatement = "";
}

//cerrarVentana
function cerrarTabla(obj){
    obj.close();
}
  
function crearTabla(){
    if(tableStatement!=="" && tableStatement.length!==0){//Si la tabla ya esta cargada
        answers = new Array();
        var valor = "";
        var n = calcularCantVariables(tableStatement);//Calcula el numero de elementos 
        var rows = Math.pow(2,n);//Cantidad de filas 
        if(ventana!==null) ventana.close(); // Si ya esta cargado la ventana, se cierra
        ventana = window.open('','ventana','width=550,height=480,top='+ ((screen.height - 480) / 2) + ',left=' + ((screen.width - 550) / 2));
        ventana.document.write('<head><title>Tabla de Verdad</title></head>');
        ventana.document.write('<style>');
        ventana.document.write('table{ width:300px; height:300px; text-align:center;');
        ventana.document.write('border:orange 6px solid;border-radius:10px;border-spacing: 0px;');
        ventana.document.write('background-color:lightgray; margin:0 auto;}');
        ventana.document.write('label{font-family: "Segoe Print",monospace;}');
        ventana.document.write('input[type="button"]{font-family: "Segoe Print",monospace;');
        ventana.document.write('color:white;background: black;border-style:solid;border-radius:10px;');
        ventana.document.write('</style>');        
        ventana.document.write('<body bgcolor="#ffeecc">');
        ventana.document.write('<table border="1">');
        ventana.document.write('<caption><label><strong>Tabla de Verdad</strong></label></caption>');
        ventana.document.write('<thead>');
        ventana.document.write('<tr>');
        for(var i=0; i<verdades.length; i++){
            if(verdades[i]){//Se carga las proposiciones
                ventana.document.write('<th><label>'+proposiciones[i].toUpperCase()+'</label></th>');
            }
        }
        if(tableStatement.length===1){
            ventana.document.write('<th><label>'+proposicionesSimples[0].toUpperCase()+'</label></th>');
        }else{
            generarEncabezado();
            for(var pos=0; pos<array.length; pos++){
                ventana.document.write('<th><label>'+ array[pos] +'</label></th>');
            }
        }
        ventana.document.write('</tr>');
        ventana.document.write('</thead>');
        //Se carga los valores 
        for(var idx=0; idx<rows; idx++){//Se cuenta hasta la cantidad de filas
            ventana.document.write('<tr>');//Se crea la fila
            var k=0;//Un contador
            for(var j=n-1;j>=0;j-=1){//Inicia cantidad de variables hasta cero
                var value = parseInt((idx/parseInt(Math.pow(2,j))))%2;
                if(value === 1) valor="t";
                else valor="f";
                ventana.document.write('<td><label>'+ valor.toUpperCase() +'</label></td>');
                cambiarValor(proposicionesSimples[k],valor);
                k++;
            }
            var resultado = new Calcular().calcularTabla();
            if(answers.length>0){
                for(var index=0; index<answers.length; index++){
                    ventana.document.write('<td><label>'+ answers[index].toUpperCase() +'</label></td>');               
                }
                tipo_tabla.push(answers[answers.length-1]);
            }else{
                ventana.document.write('<td><label>'+ resultado.toUpperCase() +'</label></td>');
                tipo_tabla.push(resultado);
            }                
            ventana.document.write('</tr>');
            answers = new Array();
        }
        ventana.document.write('</table>');
        //Se comprueba si es tautologia o contigencia
        var tipo = tipoTabla();        
        ventana.document.write('<div ALIGN="center"><label>Es una tabla de <strong>'+ tipo +'</strong></label></div>'); 
        ventana.document.write('<div ALIGN="center">');//Se centra todo
        ventana.document.write('<input type="button" value="Cerrar" onclick="opener.cerrarTabla(window)" />');//Cerrar la ventana
        ventana.document.write('</div>');
        ventana.document.write('</body>');
        array = new Array();
        proposicionesSimples = new Array();
        verdades = [false,false,false,false];
    } else alert("No hay expresión guardada");    
}

//Funcion que carga P Q R S
function calcularCantVariables(statement){
    //Inicialmente verdades tiene todo false
    var props = statement;
    for (var i=0; i<props.length; i++){
        switch (props[i]) {
            case "p":
                verdades[0] = true; //Para saber si un simbolo esta presente
                break;
            case "q":
                verdades[1] = true;
                break;
            case "r":
                verdades[2] = true;
                break;
            case "s":
                verdades[3] = true;
                break;
        }            
    }
    //Si es verdadero en el array verdadero se carga las expresiones en las proposiciones
    var cantValues = 0;
    for(var idx=0;idx<verdades.length;idx++){ //para cargar las proposiciones simples y la cantidad de variables
        if(verdades[idx]){ //Si existe el array
            switch (idx) {
                case 0:
                    proposicionesSimples.push("p");
                    break;
                case 1:
                    proposicionesSimples.push("q");
                    break;
                case 2:
                    proposicionesSimples.push("r");
                    break;
                case 3:
                    proposicionesSimples.push("s");
                    break;
            } 
            cantValues++;
        }
    }
    return cantValues;
}

//Cambiar de T a F o F a T de las proposiciones
function cambiarValor(proposicion,valor){ //Busca un valor 
    for(var i=0; i<variables.length; i++){
        if(variables[i]===proposicion){
            variables[i+1]=valor; break;
        }
    }
}

function tipoTabla(){
    var TAUTOLOGICA = 0;//Se declaran variables
    var CONTRADICCION = 0;
    for(var i=0; i<tipo_tabla.length;i++){
        if(tipo_tabla[i]==="t") TAUTOLOGICA++;
        else CONTRADICCION++;
    }
    var tipo = "";
    if(TAUTOLOGICA===tipo_tabla.length) tipo="TAUTOLOGÍA";
    else if(CONTRADICCION===tipo_tabla.length) tipo="CONTRADICCIÓN";
    else tipo="CONTINGENCIA";
    tipo_tabla = new Array();
    return tipo;
}

function generarEncabezado(){
    var expresion = tableStatement;
    if(expresion.length!==0){
        var aux = expresion;
        var e = new Expresion(aux); //Se crea un objeto con la expresion
        var exp = e.CompletoPrefija();
        for(var idx=0; idx<exp.length; idx++){
            if((exp[idx])==="!") exp.splice(idx+1,0,"V");
        }
        if((exp.length!==0)){                
            var ar = new ArbolExpresion();
            ar.ArbolExpresion(exp);
            ar.getExpresion(); 
        }
    }
}

//Logica
//Clase ArbolExpresion
function ArbolExpresion(){
    
    this.Raiz;//Se declara una raiz  
        
    this.Evaluador = function(){
        return this.Evaluar(this.Raiz);//Evalua si es una raiz, hoja y si existe la raiz
    };
    
    //Constructor del Arbol con argumento, Carga el arbol con las expresiones
    this.ArbolExpresion = function(Exp){
        var aux =  Exp[0];//El primer elemento se guarda en auxiliar
        var q = new Nodo(aux.toString());//Los auxiliares se guardan como string
        var op = new Nodo(aux.toString());//Dos nodos se guardan
        var p = new Pila();//Y una pila
        var antesOperando = false;//Si hubo un antes operando
        this.Raiz = q;//El primero es la raiz
        for(var i=1; i<Exp.length; i++){//Se recorre la expresion desde 1 porque ya se guardo la raiz el 0
            var aux2 = Exp[i]; //Se guarda el caracter en aux2
            op = new Nodo(aux2.toString()); //Se carga el op en el siguiente Nodo
            if(antesOperando){ //La primera vez dara False, si hubo un operando antes
                q = p.sacar();
                q.setHD(op);
            }else{//Si no es operador
                q.setHI(op);
                p.poner(q);
            }
            q = op;
            antesOperando = !this.operador(Exp[i]);//Si ahora es simbolo antes hubo operador
        }      
    };
    
    this.Hoja = function(nodo){
        return ((nodo.getHI()===null)&&(nodo.getHD()===null));
    };
    
    //Comprueba si existe un operador y retorna boolean
    this.operador = function(c){
        var operadores = ['&','+','>','|','!','<'];
        var existe = false;
        var aux = c.toString().charAt(0);
        for(var i=0; ((i<operadores.length) && (!existe)); i++){
            if(aux === operadores[i]) existe = true;
        }
        return existe;
    };
    
    this.Evaluar = function(R){//Obtiene la raiz
       var res="";//resultado
       if(R===null) return res;//Si la raiz es nulo retorna el resultado vacio
       else{//Si existe la raiz
            if(this.Hoja(R)){//Si tiene no tiene hojas
                var aux = R.getData(); //Se extrae el datos operador
                res = aux; //Y se guarda en el resultado
            }else{ 
                var op = R.getData().charAt(0);             
                var vizq = this.Evaluar(R.getHI());//Llama a la hoja isquierda
                var vder = this.Evaluar(R.getHD());//Llama a la hoja derecha 
                switch(op){
                    case '&' : res = (vizq==="t" && vder==="t")? "t": "f";break;
                    case '|' : res = (vizq==="f" && vder==="f")? "f": "t";break;
                    case '>' : res = (vizq==="t" && vder==="f")? "f": "t";break;
                    case '+' : res = (!(vizq===vder))? "t": "f";break;
                    case '<' : res = (vizq===vder)? "t": "f";break;
                    case '!' : res = (vder==="f")? "t": "f";break;
                    default:; break;
                }
                answers.push(res);
            }  
       }
       return res;//Se retorna el resultado
    };
    
    this.getExpresion = function(){
        this.getEncabezado(this.Raiz);//Le pasa la raiz como parametro //Se obtiene la expresion
    };
    //Saca del arbol e imprime el encabezado
    this.getEncabezado = function(R){
       var res="";
       if(R===null) return res; //Si la raiz es null retorna el resultado
       else{
            if(this.Hoja(R)){ //Caso base
                var aux = R.getData();//Comprueba si es una hoja, si es termina la recursividad
                res = aux;//Y retorna
            }else{ 
                var op = R.getData().charAt(0);//Se recupera un dato y se obtiene el primer caracter             
                var vizq = this.getEncabezado(R.getHI());//Valor de la izquierda hoja_isq
                var vder = this.getEncabezado(R.getHD());//Valor de la derecha hoja_der
                switch(op){
                    case '&' : op = 'ʌ';break;//Se le corresponde el operador a cada uno de los operadores logicos
                    case '|' : op = '∨';break;
                    case '>' : op = '→';break;
                    case '<' : op = '↔';break;
                }
                if(op==='!') res='(¬'+vder.toUpperCase()+')'; // Si es ! entonces es un no y se carga el negativo
                else res='('+vizq.toUpperCase()+op+vder.toUpperCase()+')';//Se carga los valores y el operador
                array.push(res); //Se carga el encabezado o proposicion con los respectivos parentesis
            }         
       }
       return res;//Retorna la expresion
    };
}

//Clase Calcular
function Calcular(){
      
    this.calcular = function(){ 
        var temp = finalStatement;//un auxiliar que se guarda la expresion que se cargo en la aplicacion
        var resultado="";//resultado
        var validacion = new Comprobador();//Para validar la expresion
        var vars = validacion.Scan(temp);//Se valida la operacion
        if(vars!=="wrong"){//Si la validacion no da error
            var expresion = "";//Se inicializa la expresion
            for(var i=0; i<vars.length ;i++){  //Se recorre la expresion validada
                switch (vars[i]){ //Comprueba a simbolo corresponde para cargar en la variable expresion
                    case "p":
                        expresion+=variables[1];
                        break;
                    case "q":
                        expresion+=variables[3];
                        break;
                    case "r":
                        expresion+=variables[5];
                        break;
                    case "s":
                        expresion+=variables[7];
                        break;
                    default:
                        expresion+=(vars[i]);//En ese contendria la operacion
                        break; 
                }
            }       
            if(expresion.length!==0){ //Comprueba si la expresion no esta vacia
                var aux = expresion; //Se guarda en un auxiliar
                var e = new Expresion(aux); //Se carga la expresion en un constructor de la Expresion
                var exp = e.CompletoPrefija(); //Se convierte en expresion prefija
                for(var idx=0; idx<exp.length; idx++){ 
                    if((exp[idx])==="!") exp.splice(idx+1,0,"V");//Si encuentra un ! a lado se carga un V mediante splice
                }
                if((exp.length!==0)){//Se comprueba si no esta vacio                
                    var ar = new ArbolExpresion();
                    ar.ArbolExpresion(exp); //se carga la expresion en un arbol de expresion
                    resultado = ar.Evaluador(); //Evalua la carga 
                }
            } 
            if(resultado!==""){
                var word = document.getElementById("valores").value;
                if(word.length<30){
                    document.getElementById("resultado").value = word + " ≡ " + resultado.toUpperCase();
                } else document.getElementById("resultado").value = "Expresión ≡ "+ resultado.toUpperCase();//Si desborda
            }
            else{
                document.getElementById("resultado").value = "";
                alert("No hay ninguna expresión");//No hay ninguna expresion
            }
            document.getElementById("valores").value = "";
            tableStatement=finalStatement;//Se carga toda la carga en el finalStatement
            finalStatement="";//Y finalmente se queda vacia
        }    
        return resultado;//Se retorna el resultado        
    }; 
    
    this.calcularTabla = function(){ 
        var vars = tableStatement;//La carga se guarda en una variable para que pueda recorrer
        var expresion = "";//Para al acumulacion
        for(var i=0; i<vars.length ;i++){
            switch (vars[i]){
                case "p":
                    expresion+=variables[1];
                    break;
                case "q":
                    expresion+=variables[3];
                    break;
                case "r":
                    expresion+=variables[5];
                    break;
                case "s":
                    expresion+=variables[7];
                    break;
                default:
                    expresion+=(vars[i]);
                    break; 
            }
        }
        var resultado="";
        if(expresion.length!==0){//Si esta vacio o no
             var aux = expresion;
            var e = new Expresion(aux);
            var exp = e.CompletoPrefija();
            for(var idx=0; idx<exp.length; idx++){
                if((exp[idx])==="!") exp.splice(idx+1,0,"V");
            }
            if((exp.length!==0)){//No debe estar vacio las expresiones                
                var ar = new ArbolExpresion();
                ar.ArbolExpresion(exp); //Se tranforma en arbol
                resultado = ar.Evaluador(); //Se carga nuevamente el resultado
            }
        } 
        return resultado;        
    };
}

//Clase Expresion
function Expresion(expr){
    
    this.Exp = expr; //Se guarda la expresion cargada
            
    this.getExpresion = function(){ //Se recupera la expresion
        return this.Exp;
    };
    
    this.CompletoPrefija = function() {
        var sep = this.Separar(); //Separa y solo pone las letras
        var completo = new Array();//Un array completo
        var n = sep.length-1; //se carga la cantidad - 1
        var j=0;
        var pfija = this.preFija();//Es un array
        for(var i=0;((i<pfija.length)&&(j<=n));i++){
            var e1 = pfija[i];            
            if(this.isLetterUpper(e1)){
                completo.push(sep[j]);//Se guarda si es una letra mayuscula
                j++;
            }else completo.push(e1);//Se guarda si es un operando
        }
        return completo; //Se retorna un Array
    };   
    
    this.preFija = function(){
        var c;
        var d;
        var e;
      	var i;
        var prioridadCima;//Prioridad mayor
        var prioridadOper;//Prioridad operando
      	var expPre = new Array(); //El array en donde se guardara la expresionPrefija          
          //3 Pilas
        var aux = new Pila();
        var med = new Pila();
        var pre = new Pila();
	    var Expr = this.Clasica();
        
        for(i=0;i<Expr.length;i++){
            aux.poner(Expr.charAt(i)); //Se guarda la expresion
        }
        while(!aux.vacia()){//Si no esta vacia y hay alguna expresion
            c = aux.sacar();//Se saca una expresion            
            if(c === ')'){//Se comprueba si es un parentesis
                med.poner(c);//Se guarda en med
            }else {    
                if(c === '('){
                    e = med.cima(); //Se extrae la el valor de la cima
                    while(e !== ')'){//Mientras no es parentesis de cierre se guarda en pre los valores
                        c = med.sacar(); //Se saca del parentesis el valor y se pone en pre
                        pre.poner(c);
			            e = med.cima(); //Se recupera la cima
                    }
                    med.sacar();
		        }else 
                    if(this.operador(c)){ //Se comprueba si es un operador 
                        e = med.cima(); //Se extrae la cima
		                prioridadCima = this.prioridad(e); //Se comprueba que prioridad el de la cima
                        prioridadOper = this.prioridad(c); //Se comprueba que prioridad tiene el operador
                        while(!med.vacia() && (prioridadOper < prioridadCima)){//Se comprueba la prioridad de la cima y el operador
                            d = med.sacar();
                            pre.poner(d);
                            e = med.cima();
                            prioridadCima = this.prioridad(e);
			}
                        med.poner(c);
                    }else pre.poner(c);
                }
	}
  
	while(!med.vacia()){
            c = med.sacar();
            pre.poner(c);
	}
	while(!pre.vacia()){ //Mientras no sea vacio se pone todo en la expPre
            c = pre.sacar();
            expPre.push(c);
	}
   	return expPre;
    };
    //Se comprueba si existe el operador
    this.operador = function(c){
        var operadores = ['&','+','>','|','!','<'];
        var op = false;
        for(var i=0;((i<operadores.length) && (!op)); i++){//Mientras exista la operacion
            if(operadores[i] === c) op = true; //Si encuentra la operacion se pone true
        }
       return op; 
    };
    
    //Se descubre la prioridad hay 3 tipos 0 () 1 &|><+ 2 !
    this.prioridad = function(op){
        var r = 4;
        if(op !== null){ //Solo si la operacion existe
            switch(op){
                case ')' : {r = 0; break;}//No son de importancia 0
                case '(' : {r = 0; break;}
                case '&' : {r = 1; break;}//Son de importancia 1
                case '|' : {r = 1; break;}
                case '>' : {r = 1; break;}
                case '<' : {r = 1; break;}
                case '+' : {r = 1; break;}
                case '!' : {r = 2; break;}//Los no son de mayor importancia
            }
        }
        return r;
    };

    //Solo guarda las letras unicamente
    this.Separar = function(){      
        var i=0;
        var n = ((this.Exp).length)-1;//Para usarse en un ciclo
        var aux1;//Se declaran dos auxiliares
        var aux2 = this.Exp; //Otro auxiliar donde se guarda la expresion
        var e = new Array();//Se declara un array de e
        while((i<=n)){
            while((i<=n)&&(!this.isLetter(aux2.charAt(i)))) i++; //Si i es menor a N y si la expresion no es una letra aumenta
            aux1="";//Se vacia la letra
            while((i<=n)&&((this.isLetter(aux2.charAt(i))))){ //Si i <= N y la expresion es una letra entonces
                aux1=aux1+aux2.charAt(i);
                i++;
            }
            e.push(aux1); //Se carga si es una letra unicamente
        }
        return e; //Y retorna
    };
    
    //Se comprueba si todos los textos son letras
    this.isLetter = function(texto){
       var letras="abcdefghyjklmnñopqrstuvwxyz";
       for(var i=0; i<texto.length; i++){
          if (letras.indexOf(texto.charAt(i),0)!==-1){
             return true;
          }
       }
       return false;
    };
    
    //Se comprueba si todos los texto en mayusculas son letras
    this.isLetterUpper = function(texto){
       var letras="ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
       for(var i=0; i<texto.length; i++){
          if (letras.indexOf(texto.charAt(i),0)!==-1){
             return true;
          }
       }
       return false;
    };
       
    this.Valores = function(){
        var a = this.Separar();
        var aux="[ "; 
        for(var i=0; i<a.length;i++){
            if((i+1)===a.length) aux = aux + a[i].toString();//Porque es un vector se convierte a string
            else aux = aux + a[i].toString() + " ";//Y se acumulan, se imprimen las variables
        }
        aux = aux + " ]";
        return aux;
    };
    
    this.Clasica = function(){
        var Cara = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; //Letras del abecedario en mayuscula
        var p = -1;//Cuando esta vacio algo         
        var aux = this.Exp; //Se guarda la expresion
        var n = aux.length-1; //Se guarda la longitud de la expresion
        var i = 0; //Una variable que inicializa
        var aux1 = "";//En donde se ira guardando la expresion
        while(i<=n){
            while((i<=n)&&(!this.isLetter(aux.charAt(i)))){  
                aux1 = aux1+aux.charAt(i);
                i++;
            }
            var sw=false;
            while((i<=n)&& (this.isLetter(aux.charAt(i)))){    
                if(sw===false){
                    sw=true;
                    p++;
                }
                i++;
            }
            if((p!==-1)&&(sw)) aux1 = aux1+Cara.charAt(p); //Seria el ultimo valor
        }
        return aux1;
    };
}

//Clase nodo
//Nodo
function Nodo(dat){ //La funcion funcion nodo empieza con un dato puesto
    this.HI = null;//Se ponen null las hojas
    this.data = dat; //Y el dato se carga al nodo
    this.HD = null ;
            
    this.setHI = function(Hizq){ //Se carga el HIzq
        this.HI = Hizq;
    };
    
    this.setHD = function(Hder){ //Se carga el Hder
        this.HD = Hder;
    };
    
    this.getData = function(){ //Se obtiene un dato
        return this.data;
    };
    
    this.getHI = function(){ //Se obtiene la hoja izquierda
        return this.HI;
    };
    
    this.getHD = function(){ //Se obtiene la hoja derecha
        return this.HD;
    };
    
}

//clase Pila 
function Pila(){
    //Tiene un array donde se guardara los elementos
    //Tiene una variable tope que indica cuantos ya tiene cargado, -1 es vacio
    //Maximo con lo que puede cargar
    this.v = new Array(); //Se declara un array
    this.tope = -1; //El tope empieza con -1 porque con 0 ya es un elemento cargado
    this.max = 100; //Maximo en la pila
        
    this.Pila = function(max){ //Se declara un constructor en donde se inicializa el maximo
        this.max = max;
        this.tope = -1;
    };
    
    this.vacia = function(){
        return (this.tope === -1); //Se retorna verdadero si tope === -1
    };
    
    this.llena = function(){
        return (this.tope === this.max-1);//retorna true de lleno
    };
    
    this.poner = function(dato){
        if(!this.llena()){//Se pregunta si no esta llena
            var pos = this.tope++; //Aumenta y se guarda el aumentado 
            this.v[pos] = dato; //Dato a cargar
        }
    };

    this.sacar = function(){
        var dato = null;
        if(!this.vacia()){ //Comprueba si esta vacia
            this.tope--; //Se resta el tope
            dato = this.v[this.tope];//Se extrae el valor           
        }
        return dato;//Se retorna
    };
    
    this.cima = function(){
    	if(!this.vacia()){
            var pos = this.tope-1;
            return this.v[pos];//Se retorna el elemento que esta en la cima
        }
        else return null;   //Si esta vacia retorna null
    };	
}

//clase comprobador
function Comprobador(){
    this.Scan = function(Exp){
        var x = this.limpiarEspacios(Exp); //Limpia los espacios
        if(this.okParentesis(x)){//Comprueba parentesis
            if(this.okOperadores(x)){//Comprueba operadores
                if(this.okProposiciones(x)) return x; //Comprueba Proposiciones y retorna bien
                else alert("Verifique la expresión, hay dos proposiciones juntas.");
            }else alert("Verifique la expresión, hay operadores juntos.");
        }else alert("Verifique los parentesis.");;
        return "wrong";
    };   
    this.limpiarEspacios = function(Exp){ 
        var aux = ""; 
        for(var i=0; i<Exp.length; i++){
            if(Exp.charAt(i)!==' ') aux = aux + Exp.charAt(i); //Quita los espacios
        }
        return aux;
    };
    this.okParentesis = function(Exp){
        var p = new Pila();
        for(var i=0; i<Exp.length; i++){
            if(Exp.charAt(i)==='(') p.poner(Exp.charAt(i));//Si encuentra un parentesis se pone en la pila
            else{
                if(Exp.charAt(i)===')'){//Comprueba si existe parentesis ), si la pila esta vacia no existe apertura
                    if(p.vacia()) return false;
                    else p.sacar(); //Se saca la apertura si existe el cierrte, y se comprueba la validacion de las parentesis
                }
            }
        }
        return (p.vacia()===true);     
    };
    this.okOperadores = function(Exp1){       
        var Exp = this.limpiarParentesis(Exp1);
        //Comprueba si existe operador en donde no deberia estar
        if(this.Operador(Exp.charAt(0))||(this.Operador(Exp.charAt(Exp.length-1)))) return false;
        else{
            //Comprueba si existe un operador a lado de otro, si existe se retorna false
            var sw=true;
            for(var i=1; i<Exp.length-1;i++){
                if(this.Operador(Exp.charAt(i))&&(this.Operador(Exp.charAt(i+1)))) return false;   
            }
            return sw;
        }
    };
    this.okProposiciones = function(Exp1){       
        var Exp = this.limpiarParentesis(Exp1);
        var sw=true;
        for(var i=0; i<Exp.length-1;i++){
            //Comprueba si no hay otra proposision contigua a al otra para poder validar, si hay retorna false
            if(this.Proposicion(Exp.charAt(i))&&(this.Proposicion(Exp.charAt(i+1)))) return false;   
        }
        return sw;
    };
    this.limpiarParentesis = function(Exp){
        var aux=""; 
        for(var i=0; i<Exp.length; i++){
            if((Exp.charAt(i)!=='(')&&(Exp.charAt(i)!==')')) aux = aux + Exp.charAt(i); //Se acumula aquellos que no tiene parentesis
        }
        return aux;
    }; 
    //Comprueba si existe un operador y retorna boolean
    this.Operador = function(x){
          var sw = false;
          switch(x){
             case '&' : sw = true; break;
             case '+' : sw = true; break;
             case '>' : sw = true; break;
             case '<' : sw = true; break;
             case '|' : sw = true; break;     
          }  
	  return sw;
    };
    //Comprueba si existe una proposicion y retorna boolean
    this.Proposicion = function(x){
          var sw = false;
          switch(x){
             case 'p' : sw = true; break;
             case 'q' : sw = true; break;
             case 'r' : sw = true; break;
             case 's' : sw = true; break;
          }  
	  return sw;
    };
}