// Estructura de datos en memoria para mapear qué celdas dependen de una celda dada
const grafoDependencias = {};

/**
 * Registra que una celda de destino depende de una celda de origen.
 * @param {string} celdaOrigen - Celda cuyo valor afecta a otra (ej. "A1").
 * @param {string} celdaDestino - Celda que contiene la fórmula que usa al origen (ej. "B1").
 */
function registrarDependencia(celdaOrigen, celdaDestino) {
    // Si la celda origen no tiene un conjunto de dependientes inicializado, se crea
    if (!grafoDependencias[celdaOrigen]) {
        grafoDependencias[celdaOrigen] = new Set();
    }
    // Se añade la celda destino al conjunto de dependientes del origen
    grafoDependencias[celdaOrigen].add(celdaDestino);
}