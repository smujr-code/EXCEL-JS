// NIVEL 8: Experiencia de usuario al elegir tipos de datos y desplazarse de manera sencilla por las celdas

//al presionar la tecla detele o supr, elimina los datos que contenga la celda.

document.addEventListener("keydown", function(e) {
    let barra = document.getElementById("barra-formulas");

    let esFlechaGlobal = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key);
    let esEnterGlobal = e.key === "Enter";
    let esTabGlobal = e.key === "Tab";

   if (barra && document.activeElement === barra && barra.value.startsWith("=")) {
        if (esFlechaGlobal) {
            e.preventDefault();

            // Inicializamos el puntero y guardamos la celda original de la fórmula
            if (!window.formulaPunteroRef) {
                window.formulaPunteroRef = celdaActivaRef;
                window.formulaCeldaOrigen = celdaActivaRef; 
            }

            let colCode = window.formulaPunteroRef.charCodeAt(0);
            let filaNum = parseInt(window.formulaPunteroRef.slice(1));

            if (e.key === "ArrowDown") filaNum += 1;
            else if (e.key === "ArrowUp") filaNum -= 1;
            else if (e.key === "ArrowRight") colCode += 1;
            else if (e.key === "ArrowLeft") colCode -= 1;

            if (filaNum < 1) filaNum = 1;
            if (filaNum > TOTAL_FILAS) filaNum = TOTAL_FILAS;
            if (colCode < 65) colCode = 65;
            if (colCode > 64 + TOTAL_COLUMNAS) colCode = 64 + TOTAL_COLUMNAS;

            window.formulaPunteroRef = `${String.fromCharCode(colCode)}${filaNum}`;

            // Mueve el foco visualmente en la tabla para ver la celda, SIN cambiar la celda activa real todavía
            let tdDestino = document.querySelector(`[data-ref='${window.formulaPunteroRef}']`);
            if (tdDestino) {
                document.querySelectorAll(".cell").forEach(c => c.classList.remove("celda-activa"));
                tdDestino.classList.add("celda-activa");
                let label = document.getElementById("celda-activa-label");
                if (label) label.textContent = window.formulaPunteroRef;
            }
            barra.focus();

            let val = barra.value.trim();
            let matchRef = val.match(/[A-Z]+\d+$/);

            if (matchRef) {
                barra.value = val.replace(/[A-Z]+\d+$/, window.formulaPunteroRef);
            } else {
                barra.value = val + window.formulaPunteroRef;
            }

            barra.dispatchEvent(new Event('input'));
            return;
        }

        if (esEnterGlobal || esTabGlobal) {
            e.preventDefault();
            // Aplica el resultado únicamente en la celda donde comenzó a escribirse la fórmula
            let celdaDestinoFinal = window.formulaCeldaOrigen || celdaActivaRef;
            aplicarValorCelda(celdaDestinoFinal, barra.value);
            
            seleccionarCelda(celdaDestinoFinal);
            window.formulaPunteroRef = null;
            window.formulaCeldaOrigen = null;
            barra.blur();
            return;
        }
    } else {
        window.formulaPunteroRef = null;
        window.formulaCeldaOrigen = null;
    }
    if (e.key === "Delete" || e.key === "Del") {
        e.preventDefault();
        if (barra) {
            barra.value = "";
            barra.dispatchEvent(new Event('input'));
        }
       if (celdaActivaRef) {
            let tdActual = document.querySelector(`[data-ref='${celdaActivaRef}']`);
            if (tdActual && tdActual.dataset.valorPrevio === undefined) {
                tdActual.dataset.valorPrevio = obtenerValorCelda(celdaActivaRef);
            }
            aplicarValorCelda(celdaActivaRef, "");
        }
        return;
    }

   if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        console.log("-> Ctrl+Z presionado. Celda activa:", celdaActivaRef);
        let tdActiva = document.querySelector(`[data-ref='${celdaActivaRef}']`);
        if (tdActiva) {
            let valorAnterior = tdActiva.dataset.valorPrevio !== undefined ? tdActiva.dataset.valorPrevio : "";
            console.log("-> Restaurando valor previo:", valorAnterior);
            
            aplicarValorCelda(celdaActivaRef, valorAnterior); 
            
            let barra = document.getElementById("barra-formulas");
            if (barra) {
                barra.value = valorAnterior;
                barra.dispatchEvent(new Event('input')); 
            }
        }
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
        let barra = document.getElementById("barra-formulas");
        
        // Si el usuario está escribiendo en la barra de fórmulas, permitir navegación libre con flechas o Enter para aplicar
        if (barra && document.activeElement === barra) {
            if (esEnter) {
                e.preventDefault();
                aplicarValorCelda(celdaActivaRef, barra.value);
                barra.blur();
            }
            return; // Salir para no interferir con las flechas dentro del input de fórmulas
        }

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
            let td = document.querySelector(`[data-ref='${siguienteRef}']`);
            if (td) {
                td.dataset.valorPrevio = typeof obtenerValorCelda === 'function' ? obtenerValorCelda(siguienteRef) : (td.textContent || "");
            }
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

function estaEditandoFormula() {
    let barra = document.getElementById("barra-formulas");
    if (barra && barra.value.startsWith("=")) return true;
    
    let tdActiva = document.querySelector(`[data-ref='${celdaActivaRef}']`);
    if (tdActiva) {
        let valorCelda = typeof obtenerValorCelda === 'function' ? obtenerValorCelda(celdaActivaRef) : "";
        if (String(valorCelda).startsWith("=")) return true;
    }
    return false;
}