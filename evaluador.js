// Analiza una porción de texto individual y determina si corresponde
//  a una función estadística (SUMA, PROMEDIO, MAX, MIN), una referencia
//  de celda válida (REF), un número flotante (NUM) o un error léxico (ERROR).

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