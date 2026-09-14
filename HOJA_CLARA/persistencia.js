// NIVEL 7
//función que permite guardar la información

function guardarEstadoLocal() {
    localStorage.setItem("hojaClaraData", JSON.stringify(estadoCeldas));
    alert("¡Hoja guardada exitosamente en el almacenamiento local!");
}