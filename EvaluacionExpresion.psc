Funcion resultado <- EvaluarFactor(tokens, cantidad, posicion Por Referencia)
	
    Definir resultado Como Real
	
    Si tokens[posicion] = "(" Entonces
		
        posicion <- posicion + 1
        resultado <- EvaluarExpresion(tokens, cantidad, posicion)
		
        Si tokens[posicion] = ")" Entonces
            posicion <- posicion + 1
        FinSi
		
    Sino
		
        resultado <- ConvertirANumero(tokens[posicion])
        posicion <- posicion + 1
		
    FinSi
	
FinFuncion


Funcion resultado <- EvaluarTermino(tokens, cantidad, posicion Por Referencia)
	
    Definir resultado, siguiente Como Real
    Definir operador Como Cadena
	
    resultado <- EvaluarFactor(tokens, cantidad, posicion)
	
    Mientras posicion <= cantidad Y (tokens[posicion] = "*" O tokens[posicion] = "/") Hacer
		
        operador <- tokens[posicion]
        posicion <- posicion + 1
		
        siguiente <- EvaluarFactor(tokens, cantidad, posicion)
		
        Si operador = "*" Entonces
            resultado <- resultado * siguiente
        Sino
            resultado <- resultado / siguiente
        FinSi
		
    FinMientras
	
FinFuncion


Funcion resultado <- EvaluarExpresion(tokens, cantidad, posicion Por Referencia)
	
    Definir resultado, siguiente Como Real
    Definir operador Como Cadena
	
    resultado <- EvaluarTermino(tokens, cantidad, posicion)
	
    Mientras posicion <= cantidad Y (tokens[posicion] = "+" O tokens[posicion] = "-") Hacer
		
        operador <- tokens[posicion]
        posicion <- posicion + 1
		
        siguiente <- EvaluarTermino(tokens, cantidad, posicion)
		
        Si operador = "+" Entonces
            resultado <- resultado + siguiente
        Sino
            resultado <- resultado - siguiente
        FinSi
		
    FinMientras
	
FinFuncion


Algoritmo EvaluacionExpresion
	
    Definir cantidad, posicion Como Entero
    Definir resultado Como Real
    Dimension tokens[100]
	
    // Tokens que vienen del algoritmo anterior
    cantidad <- 5
	
    tokens[1] <- "2"
    tokens[2] <- "+"
    tokens[3] <- "3"
    tokens[4] <- "*"
    tokens[5] <- "4"
	
    posicion <- 1
	
    resultado <- EvaluarExpresion(tokens, cantidad, posicion)
	
    Escribir "Resultado: ", resultado
	
FinAlgoritmo