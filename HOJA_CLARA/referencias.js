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
// Recalcula las celdas que dependen de una celda modificada.
function propasarRecalculo(celdaModificada, actualizarCeldaUI) {

    let cola = [celdaModificada];
    let procesados = new Set();

    while (cola.length > 0) {

        let actual = cola.shift();

        if (procesados.has(actual)) continue;
        procesados.add(actual);

        let dependientes = grafoDependencias[actual];

        if (dependientes) {

            for (let dep of dependientes) {

                // Verificar si existe una referencia circular
                if (detectarReferenciaCircular(dep)) {

                    if (estadoCeldas[dep]) {
                        estadoCeldas[dep].valor = "#ERROR!";
                        actualizarCeldaUI(dep, "#ERROR!");
                    }

                    continue;
                }

                // Recalcular la celda dependiente si tiene fórmula
                if (estadoCeldas[dep] && estadoCeldas[dep].formula) {

                    let valorCalculado =
                        evaluarFormulaCelda(estadoCeldas[dep].formula);

                    estadoCeldas[dep].valor = valorCalculado;

                    actualizarCeldaUI(dep, valorCalculado);
                }

                // Continuar con las siguientes dependencias
                cola.push(dep);
            }
        }
    }
}

function evaluarFormulaCelda(formula) {

    let tokens = tokenizarFormula(formula);

    return evaluarExpresionAritmetica(
        tokens,
        (ref) => obtenerValorCelda(ref)
    );
}