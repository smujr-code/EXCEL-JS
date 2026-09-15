/* Analiza una porción de texto individual y determina si corresponde
a una función estadística (SUMA, PROMEDIO, MAX, MIN), una referencia
 de celda válida (REF), un número flotante (NUM) o un error léxico (ERROR).*/

function clasificarToken(t) {
    let tUpper = t.toUpperCase();

    if (["SUMA", "PROMEDIO", "MAX", "MIN"].includes(tUpper)) {
        return { tipo: "FUNC", valor: tUpper };
    } else if (/^[A-Z]+\d+$/.test(tUpper)) {
        return { tipo: "REF", valor: tUpper };
    } else {
        let numero = parseFloat(t);

        if (isNaN(numero)) {
            return { tipo: "ERROR", valor: t };
        }

        return { tipo: "NUM", valor: numero };
    }
}

// Recorre la fórmula carácter por carácter para separar operadores 
// y separadores, y agrupa los textos para su posterior clasificación.

function tokenizarFormula(formula) {
    let resultadoTokens = [];
    let token = "";

    for (let i = 0; i < formula.length; i++) {
        let caracter = formula[i];

        if ("+-*/(),:;".includes(caracter)) {
            if (token !== "") {
                resultadoTokens.push(clasificarToken(token.trim()));
                token = "";
            }

            if (caracter !== "," && caracter !== ";") {
                resultadoTokens.push({ tipo: "OP", valor: caracter });
            } else {
                resultadoTokens.push({ tipo: "SEPARADOR", valor: caracter });
            }
        } else {
            if (caracter !== "=" && caracter !== " ") {
                token += caracter;
            }
        }
    }

    if (token !== "") {
        resultadoTokens.push(clasificarToken(token.trim()));
    }

    return resultadoTokens;
}

function evaluarExpresionAritmetica(tokens, obtenerValorCeldaCallback) {
    try {
        // No hay tokens: fórmula vacía o incorrecta
        if (tokens.length === 0) {
            return "#ERROR!";
        }

        // Detectar tokens inválidos
        for (let token of tokens) {
            if (token.tipo === "ERROR") {
                return "#ERROR!";
            }
        }

        // Procesar funciones de rango
       if (tokens[0].tipo === "FUNC") {
    let nombreFn = tokens[0].valor;
    let argumentosTokens = tokens.slice(2, tokens.length - 1);

    let argumentoStr = argumentosTokens.map(t => {
        return t.valor;
    }).join("");

    return procesarFuncionRango(
        nombreFn,
        argumentoStr,
        obtenerValorCeldaCallback
    );
}
        let expresionResuelta = "";

        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];

            if (token.tipo === "NUM") {
                expresionResuelta += token.valor + " ";

            } else if (token.tipo === "REF") {
                let valRef = obtenerValorCeldaCallback(token.valor);

                // Referencia inexistente o vacía
                if (valRef === "" || valRef === undefined || valRef === null) {
                    return "#ERROR!";
                }

                // Propagar errores de otras celdas
                if (typeof valRef === "string" && valRef.startsWith("#")) {
                    return valRef;
                }

                // Verificar que sea un número
                if (isNaN(valRef)) {
                    return "#ERROR!";
                }

                expresionResuelta += parseFloat(valRef) + " ";

            } else if (token.tipo === "OP") {
                expresionResuelta += token.valor + " ";

            } else {
                return "#ERROR!";
            }
        }

        // Evaluar la expresión respetando prioridad
        return evaluarOperacionBasica(expresionResuelta);

    } catch (error) {
        return "#ERROR!";
    }
}
// Primero realiza * y / y después + y -.

function evaluarOperacionBasica(expresion) {
    try {
        let valores = expresion.trim().split(/\s+/);

        if (valores.length === 0) {
            return "#ERROR!";
        }

        // Validar estructura básica de la expresión
        if (valores.length % 2 === 0) {
            return "#ERROR!";
        }

        // Resolver multiplicaciones y divisiones
        for (let i = 1; i < valores.length - 1; i++) {

            if (valores[i] === "*" || valores[i] === "/") {
                let numero1 = parseFloat(valores[i - 1]);
                let numero2 = parseFloat(valores[i + 1]);

                if (isNaN(numero1) || isNaN(numero2)) {
                    return "#ERROR!";
                }

                // Detectar división entre cero
                if (valores[i] === "/" && numero2 === 0) {
                    return "#DIV/0!";
                }

                let resultado;

                if (valores[i] === "*") {
                    resultado = numero1 * numero2;
                } else {
                    resultado = numero1 / numero2;
                }

                valores.splice(i - 1, 3, resultado);
                i = 0;
            }
        }

        // Resolver sumas y restas
        let resultado = parseFloat(valores[0]);

        if (isNaN(resultado)) {
            return "#ERROR!";
        }

        for (let i = 1; i < valores.length; i += 2) {
            let numero = parseFloat(valores[i + 1]);

            if (isNaN(numero)) {
                return "#ERROR!";
            }

            if (valores[i] === "+") {
                resultado += numero;

            } else if (valores[i] === "-") {
                resultado -= numero;

            } else {
                return "#ERROR!";
            }
        }

        return resultado;

    } catch (error) {
        return "#ERROR!";
    }
}