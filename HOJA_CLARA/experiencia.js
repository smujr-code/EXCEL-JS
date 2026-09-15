// NIVEL 8: Experiencia de usuario al elegir tipos de datos y desplazarse de manera sencilla por las celdas

//al presionar la tecla detele o supr, elimina los datos que contenga la celda.
document.addEventListener("keydown", function(e) {
    let barra = document.getElementById("barra-formulas");

    if (e.key === "Delete" || e.key === "Del") {
        e.preventDefault();
        if (barra) {
            barra.value = "";
            barra.dispatchEvent(new Event('input'));
        }
        if (celdaActivaRef) {
            aplicarValorCelda(celdaActivaRef, "");
        }
        return;
    }

    if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        deshacerAccion();
        return;
    }
//desplazamiento entre celdas con teclados
let esFlecha = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key);
    let esEnter = e.key === "Enter";

if (e.shiftKey && esFlecha) {
        e.preventDefault();

        if (!window.celdaInicioShift) {
            window.celdaInicioShift = celdaActivaRef;
            window.celdaFinShift = celdaActivaRef;
        }

        let colCode = window.celdaFinShift.charCodeAt(0);
        let filaNum = parseInt(window.celdaFinShift.slice(1));

        if (e.key === "ArrowDown") filaNum += 1;
        else if (e.key === "ArrowUp") filaNum -= 1;
        else if (e.key === "ArrowRight") colCode += 1;
        else if (e.key === "ArrowLeft") colCode -= 1;

        if (filaNum < 1) filaNum = 1;
        if (filaNum > TOTAL_FILAS) filaNum = TOTAL_FILAS;
        if (colCode < 65) colCode = 65;
        if (colCode > 64 + TOTAL_COLUMNAS) colCode = 64 + TOTAL_COLUMNAS;

        window.celdaFinShift = `${String.fromCharCode(colCode)}${filaNum}`;

        limpiarSeleccion();
        mostrarRangoSeleccion(window.celdaInicioShift, window.celdaFinShift);
        return;
    } else if (!e.shiftKey) {
        window.celdaInicioShift = null;
        window.celdaFinShift = null;
    }

     if (esEnter || esFlecha) {
        e.preventDefault();

        if (barra && document.activeElement === barra) {
            aplicarValorCelda(celdaActivaRef, barra.value);
            barra.blur();
        }

        let colCode = celdaActivaRef.charCodeAt(0);
        let filaNum = parseInt(celdaActivaRef.slice(1));

        if (e.key === "ArrowDown" || esEnter) filaNum += 1;
        else if (e.key === "ArrowUp") filaNum -= 1;
        else if (e.key === "ArrowRight") colCode += 1;
        else if (e.key === "ArrowLeft") colCode -= 1;

        if (filaNum < 1) filaNum = 1;
        if (filaNum > TOTAL_FILAS) filaNum = TOTAL_FILAS;
        if (colCode < 65) colCode = 65;
        if (colCode > 64 + TOTAL_COLUMNAS) colCode = 64 + TOTAL_COLUMNAS;

        let siguienteRef = `${String.fromCharCode(colCode)}${filaNum}`;
        let celdaDestino = document.querySelector(`[data-ref='${siguienteRef}']`);
        if (celdaDestino) {
            seleccionarCelda(siguienteRef);
        }
        return;
    }
if (document.activeElement !== barra && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (barra) {
            barra.value = e.key;
            barra.focus();
            barra.setSelectionRange(1, 1);
            barra.dispatchEvent(new Event('input'));
        }
    }
});