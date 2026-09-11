/*Crea el objeto central en memoria que almacenará la
información de las celdas de forma independiente al DOM*/
JavaScript
const estadoCeldas = {};

/*Define la función que asigna o actualiza el valor de 
una celda específica dentro del objeto de estado global*/
function guardarValorCelda(ref, valor) {
    if (!estadoCeldas[ref]) {
        estadoCeldas[ref] = {};
    }

    estadoCeldas[ref].valor = valor;
}

// Normaliza la referencia a mayúsculas y valida que
//  esté dentro de los límites de la cuadrícula (A-J, 1-15); retorna #ERROR! si no es válida.
function obtenerValorCelda(ref) {
    ref = ref.toUpperCase().trim();

    // Validar que la referencia corresponda a la cuadrícula
    let coincidencia = ref.match(/^([A-J])([1-9]|1[0-5])$/);

    if (!coincidencia) {
        return "#ERROR!";
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