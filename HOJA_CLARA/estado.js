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