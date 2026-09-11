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