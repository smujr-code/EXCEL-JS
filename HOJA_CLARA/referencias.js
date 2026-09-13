//Registros de enlaces
// Estructura para registrar qué celdas dependen de una celda dada
const grafoDependencias = {};

function registrarDependencia(celdaOrigen, celdaDestino) {
    if (!grafoDependencias[celdaOrigen]) {
        grafoDependencias[celdaOrigen] = new Set();
    }

    grafoDependencias[celdaOrigen].add(celdaDestino);
}

// Comprueba si una dependencia termina regresando a la celda inicial.
function detectarReferenciaCircular(celdaInicial, celdaActual = celdaInicial, visitados = new Set()) {

    if (visitados.has(celdaActual)) {
        return celdaActual === celdaInicial;
    }

    visitados.add(celdaActual);

    let dependientes = grafoDependencias[celdaActual];

    if (dependientes) {
        for (let dep of dependientes) {
            if (detectarReferenciaCircular(celdaInicial, dep, visitados)) {
                return true;
            }
        }
    }

    visitados.delete(celdaActual);
    return false;
}
//s
