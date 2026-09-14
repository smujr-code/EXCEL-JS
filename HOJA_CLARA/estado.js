// VALORES DE CELDA

const estadoCeldas = {};

function guardarValorCelda(ref, valor) {
    if (!estadoCeldas[ref]) {
        estadoCeldas[ref] = {};
    }

    estadoCeldas[ref].valor = valor;
}


function obtenerValorCelda(ref) {
    ref = ref.toUpperCase().trim();

    // Validar que la referencia corresponda a la cuadrícula
    let coincidencia = ref.match(/^([A-J])([1-9]|1[0-5])$/);

    if (!coincidencia) {
        return "#ERROR!";
    }

    // 1. Buscar en el estado interno
    if (estadoCeldas[ref]) {
        let val = estadoCeldas[ref].valor;

        if (val !== undefined && val !== "" && val !== null) {
            return val;
        }
    }

    // 2. Respaldo directo desde el DOM si la celda ya fue renderizada
    let celdaDom = document.querySelector(`[data-ref='${ref}']`);

    if (celdaDom) {
        let input = celdaDom.querySelector("input");

        if (input && input.value !== "" && !input.value.startsWith("=")) {
            return input.value;
        }

        let texto = celdaDom.textContent.trim();

        if (texto !== "" && !texto.startsWith("=")) {
            return texto;
        }
    }

    // La celda existe, pero está vacía
    return "";
}