//Registros de enlaces
// Estructura para registrar qué celdas dependen de una celda dada
const grafoDependencias = {};

function registrarDependencia(celdaOrigen, celdaDestino) {
    if (!grafoDependencias[celdaOrigen]) {
        grafoDependencias[celdaOrigen] = new Set();
    }

    grafoDependencias[celdaOrigen].add(celdaDestino);
}