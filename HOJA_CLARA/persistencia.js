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
//limpia las hoja al borrar cual tipo de caracter que ella contenga.
function limpiarTodaLaHoja() {
    if (confirm("¿Estás seguro de que deseas limpiar toda la hoja y borrar los datos guardados?")) {
        localStorage.removeItem("hojaClaraData");
        Object.keys(estadoCeldas).forEach(k => delete estadoCeldas[k]);
        location.reload();
    }
}
//permite la exportación de los datos contenidos en la hoja clara, guardandolos en descarga como hojaclara_exportado.csv
function exportarACSV() {
    let csvContent = "";
    for (let i = 1; i <= TOTAL_FILAS; i++) {
        let filaArr = [];
        for (let j = 1; j <= TOTAL_COLUMNAS; j++) {
            let ref = `${generarLetraColumna(j)}${i}`;
            let val = obtenerValorCelda(ref) || "";
            filaArr.push(`"${val}"`);
        }
        csvContent += filaArr.join(",") + "\n";
    }

    let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "hojaclara_exportado.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function deshacerAccion() {
    if (historialUndo.length === 0) return;
    
    historialRedo.push(JSON.stringify(estadoCeldas));
    let estadoAnterior = JSON.parse(historialUndo.pop());
    
    Object.keys(estadoCeldas).forEach(k => delete estadoCeldas[k]);
    Object.assign(estadoCeldas, estadoAnterior);
    
    location.reload(); // Recarga limpia para actualizar la UI con el estado previo
}