/* Analiza una porción de texto individual y determina si corresponde
a una función estadística (SUMA, PROMEDIO, MAX, MIN), una referencia
 de celda válida (REF), un número flotante (NUM) o un error léxico (ERROR).*/

function clasificarToken(t) {
    let tUpper = t.toUpperCase();

    if (["SUMA", "PROMEDIO", "MAX", "MIN"].includes(tUpper)) {
        return { tipo: "FUNC", valor: tUpper };
    } else if (t.length > 0 && t[0] >= "A" && t[0] <= "Z") {
        return { tipo: "REF", valor: tUpper };
    } else {
        let numero = parseFloat(t);

        if (isNaN(numero)) {
            return { tipo: "ERROR", valor: t };
        }

        return { tipo: "NUM", valor: numero };
    }
}

// Recorre la fórmula carácter por carácter para separar operadores y separadores, y agrupa los textos para su posterior clasificación.

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