Algoritmo TokenizarFormula
	Definir formula, caracter, tokenActual, primerCaracter Como Cadena
	Definir i, cantidadTokens Como Entero
	Dimensionar tokens(100)
	Dimensionar tipos(100)
	formula <- '=A1+B2*3'
	tokenActual <- ''
	cantidadTokens <- 0
	Para i<-1 Hasta Longitud(formula)-1 Hacer
		caracter <- Subcadena(formula,i,i)
		Si caracter='+' O caracter='-' O caracter='*' O caracter='/' O caracter='(' O caracter=')' Entonces
			Si tokenActual<>'' Entonces
				cantidadTokens <- cantidadTokens+1
				tokens[cantidadTokens] <- tokenActual
				primerCaracter <- Subcadena(tokenActual,0,0)
				Si primerCaracter>='A' Y primerCaracter<='Z' Entonces
					tipos[cantidadTokens] <- 'Referencia'
				SiNo
					tipos[cantidadTokens] <- 'Numero'
				FinSi
				tokenActual <- ''
			FinSi
			cantidadTokens <- cantidadTokens+1
			tokens[cantidadTokens] <- caracter
			Si caracter='(' O caracter=')' Entonces
				tipos[cantidadTokens] <- 'Parentesis'
			SiNo
				tipos[cantidadTokens] <- 'Operador'
			FinSi
		SiNo
			Si caracter<>' ' Entonces
				tokenActual <- tokenActual+caracter
			FinSi
		FinSi
	FinPara
	Si tokenActual<>'' Entonces
		cantidadTokens <- cantidadTokens+1
		tokens[cantidadTokens] <- tokenActual
		primerCaracter <- Subcadena(tokenActual,0,0)
		Si primerCaracter>='A' Y primerCaracter<='Z' Entonces
			tipos[cantidadTokens] <- 'Referencia'
		SiNo
			tipos[cantidadTokens] <- 'Numero'
		FinSi
	FinSi
	Para i<-1 Hasta cantidadTokens Hacer
		Escribir tokens[i], ' - ', tipos[i]
	FinPara
FinAlgoritmo
