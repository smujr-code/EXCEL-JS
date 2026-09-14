// NIVEL 7
//función que permite guardar la información

function guardarEstadoLocal() {
    localStorage.setItem("hojaClaraData", JSON.stringify(estadoCeldas));
    alert("¡Hoja guardada exitosamente en el almacenamiento local!");
}
// Carga los datos guardados en el almacenamiento local y actualiza el estado de las celdas 
function cargarEstadoLocal() {
    let datosGuardados = localStorage.getItem("hojaClaraData");
    if (datosGuardados) {
        let parsedData = JSON.parse(datosGuardados);

        Object.keys(estadoCeldas).forEach(k => delete estadoCeldas[k]);
        Object.assign(estadoCeldas, parsedData);

        location.reload();
    } else {
        alert("No hay datos guardados previamente.");
    }
}