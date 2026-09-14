//Procesamiento de funciones SUMA(), PROMEDIO(), MAX() y MIN()
function procesarFuncionRango(nombreFuncion, argumentoStr, obtenerValorCeldaCallback) {
    let celdasAfectadas = [];

    if (argumentoStr.includes(":")) {
        let [celdaInicio, celdaFin] = argumentoStr.split(":");
        celdasAfectadas = expandirRango(celdaInicio.trim(), celdaFin.trim());

    } else if (argumentoStr.includes(";") || argumentoStr.includes(",")) {
        celdasAfectadas = argumentoStr.split(/[,;]/).map(c => c.trim());

    } else {
        celdasAfectadas = [argumentoStr.trim()];
    }

    let valores = [];

    for (let ref of celdasAfectadas) {
        let val = obtenerValorCeldaCallback(ref);

        // Detectar referencia inexistente o vacía
        if (val === "" || val === undefined || val === null) {
            continue;
        }

        // Propagar errores de otras celdas
        if (typeof val === "string" && val.startsWith("#")) {
            return val;
        }

        // Verificar que el valor sea numérico
        if (isNaN(val)) {
            return "#ERROR!";
        }

        valores.push(parseFloat(val));
    }

    // Si no existen valores numéricos
    if (valores.length === 0) {
        return 0;
    }

    switch (nombreFuncion.toUpperCase()) {

        case "SUMA":
            return valores.reduce((a, b) => a + b, 0);

        case "PROMEDIO":
            return valores.reduce((a, b) => a + b, 0) / valores.length;

        case "MAX":
            return Math.max(...valores);

        case "MIN":
            return Math.min(...valores);

        default:
            return "#ERROR!";
    }
}
// Expación de rangos Ejemplo: A1:B3
// Resultado: A1, A2, A3, B1, B2, B3
function expandirRango(inicio, fin) {

    let colInicio = inicio.charCodeAt(0);
    let filaInicio = parseInt(inicio.slice(1));

    let colFin = fin.charCodeAt(0);
    let filaFin = parseInt(fin.slice(1));

    let listaCeldas = [];

    for (let c = colInicio; c <= colFin; c++) {
        for (let f = filaInicio; f <= filaFin; f++) {
            listaCeldas.push(String.fromCharCode(c) + f);
        }
    }

    return listaCeldas;
}
