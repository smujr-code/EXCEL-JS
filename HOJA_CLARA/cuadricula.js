// GENERACIÓN DE CUADRÍCULA Y GESTIÓN DE EDICIÓN (CON BARRA SUPERIOR)
const TOTAL_FILAS = 15;
const TOTAL_COLUMNAS = 10;

let celdaActivaRef = "A1";
let seleccionandoRango = false;
let celdaInicioSeleccion = null;
let celdaFinSeleccion = null;

// GENERAR LETRA DE COLUMNA
function generarLetraColumna(indice) {
    return String.fromCharCode(64 + indice);
}
// INICIALIZAR CUADRÍCULA Y EVENTOS GLOBALES

document.addEventListener("DOMContentLoaded", function() {
    inicializarCuadricula();
    configurarBarraFormulasGlobal();
    configurarSelectorFormatoGlobal();
});

function inicializarCuadricula() {
    const contenedor = document.getElementById("grid-container");
    if (!contenedor) return;

    // Aplicar estilos estrictos al contenedor para garantizar scroll interno y evitar que se desborde la página
    contenedor.style.overflow = "auto";
    contenedor.style.height = "380px";
    contenedor.style.maxHeight = "380px";
    contenedor.style.position = "relative";
    contenedor.style.boxSizing = "border-box";

    let datosPrevios = localStorage.getItem("hojaClaraData");
    if (datosPrevios && typeof estadoCeldas !== 'undefined' && Object.keys(estadoCeldas).length === 0) {
        Object.assign(estadoCeldas, JSON.parse(datosPrevios));
    }

    const tabla = document.createElement("table");
    tabla.style.borderCollapse = "collapse";
    tabla.style.width = "100%";
    tabla.style.backgroundColor = "#ffffff";

    const thead = document.createElement("thead");
    const filaEncabezado = document.createElement("tr");
    
    // Esquina superior izquierda (inmovilizada en X y Y con prioridad superior)
    const thEsquina = document.createElement("th");
    thEsquina.style.position = "sticky";
    thEsquina.style.top = "0";
    thEsquina.style.left = "0";
    thEsquina.style.zIndex = "4";
    thEsquina.style.backgroundColor = "#f1f3f4";
    thEsquina.style.border = "1px solid #d0d5dd";
    filaEncabezado.appendChild(thEsquina);

    for (let j = 1; j <= TOTAL_COLUMNAS; j++) {
        const th = document.createElement("th");
        th.textContent = generarLetraColumna(j);
        // Inmovilizar encabezados de columna (Fila superior)
        th.style.position = "sticky";
        th.style.top = "0";
        th.style.zIndex = "2";
        th.style.backgroundColor = "#f1f3f4";
        th.style.border = "1px solid #d0d5dd";
        th.style.padding = "6px 12px";
        th.style.textAlign = "center";
        filaEncabezado.appendChild(th);
    }
    thead.appendChild(filaEncabezado);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");

    for (let i = 1; i <= TOTAL_FILAS; i++) {
        const fila = document.createElement("tr");
        
        // Inmovilizar la columna de números de las filas a la izquierda
        const thFila = document.createElement("th");
        thFila.textContent = i;
        thFila.style.position = "sticky";
        thFila.style.left = "0";
        thFila.style.zIndex = "3";
        thFila.style.backgroundColor = "#f1f3f4";
        thFila.style.border = "1px solid #d0d5dd";
        thFila.style.cursor = "pointer";
        thFila.style.padding = "4px 8px";
        thFila.style.textAlign = "center";

        // Evento para seleccionar toda la fila al hacer clic en el número lateral
        thFila.addEventListener("click", function() {
            limpiarSeleccion();
            for (let j = 1; j <= TOTAL_COLUMNAS; j++) {
                let letraCol = generarLetraColumna(j);
                let refCelda = `${letraCol}${i}`;
                marcarCelda(refCelda);
            }
            celdaActivaRef = `A${i}`;
            let label = document.getElementById("celda-activa-label");
            if (label) label.textContent = celdaActivaRef;
            actualizarSelectorFormato(celdaActivaRef);
        });

        fila.appendChild(thFila);

        for (let j = 1; j <= TOTAL_COLUMNAS; j++) {
            const td = document.createElement("td");
            const letraCol = generarLetraColumna(j);
            const refCelda = `${letraCol}${i}`;

            td.className = "cell";
            td.dataset.ref = refCelda;
            
            let valorInicial = obtenerValorCelda(refCelda);
            let formatoCelda = (typeof estadoCeldas !== 'undefined' && estadoCeldas[refCelda] && estadoCeldas[refCelda].formato) 
                ? estadoCeldas[refCelda].formato 
                : "normal";
            
            formatearTextoCelda(td, valorInicial, formatoCelda);

            td.addEventListener("click", function(e) {
                let barra = document.getElementById("barra-formulas");
                
                if (barra && barra.value.startsWith("=")) {
                    let inicio = barra.selectionStart;
                    let fin = barra.selectionEnd;
                    barra.value = barra.value.substring(0, inicio) + refCelda + barra.value.substring(fin);
                    barra.focus();
                    barra.dispatchEvent(new Event('input'));
                    e.stopPropagation();
                    return;
                }

                seleccionarCelda(refCelda);
                if (barra) barra.focus();
            });

            td.addEventListener("mousedown", function(e) {
                let barra = document.getElementById("barra-formulas");
                if (!barra || !barra.value.startsWith("=")) return;

                e.preventDefault();
                seleccionandoRango = true;
                celdaInicioSeleccion = refCelda;
                celdaFinSeleccion = refCelda;
                limpiarSeleccion();
                marcarCelda(refCelda);
            });

            td.addEventListener("mouseenter", function() {
                if (!seleccionandoRango) return;
                celdaFinSeleccion = refCelda;
                mostrarRangoSeleccion(celdaInicioSeleccion, celdaFinSeleccion);
            });

            fila.appendChild(td);
        }
        tbody.appendChild(fila);
    }
    tabla.appendChild(tbody);

    contenedor.appendChild(tabla);

    document.addEventListener("mouseup", function() {
        if (!seleccionandoRango) return;
        seleccionandoRango = false;

        if (celdaInicioSeleccion && celdaFinSeleccion) {
            let barra = document.getElementById("barra-formulas");
            if (barra) {
                let rangoRef = (celdaInicioSeleccion === celdaFinSeleccion) ? celdaInicioSeleccion : `${celdaInicioSeleccion}:${celdaFinSeleccion}`;
                let inicio = barra.selectionStart;
                let fin = barra.selectionEnd;
                barra.value = barra.value.substring(0, inicio) + rangoRef + barra.value.substring(fin);
                barra.focus();
                barra.dispatchEvent(new Event('input'));
            }
        }
        limpiarSeleccion();
        celdaInicioSeleccion = null;
        celdaFinSeleccion = null;
    });

    seleccionarCelda("A1");
}

// GESTIÓN DE LA BARRA DE FÓRMULAS Y SELECTOR DE FORMATO
function configurarBarraFormulasGlobal() {
    let barra = document.getElementById("barra-formulas");
    if (!barra) return;

    barra.addEventListener("input", function() {
        let td = document.querySelector(`[data-ref='${celdaActivaRef}']`);
        if (td) {
            let valorActual = barra.value;
            let formatoActual = (typeof estadoCeldas !== 'undefined' && estadoCeldas[celdaActivaRef] && estadoCeldas[celdaActivaRef].formato) 
                ? estadoCeldas[celdaActivaRef].formato 
                : "normal";
            
            if (valorActual.startsWith("=")) {
                let formulaLimpia = valorActual.substring(1).trim();
                
                if (formulaLimpia === "" || /^[A-Z]+\s*\(?$/.test(formulaLimpia)) {
                    formatearTextoCelda(td, valorActual, formatoActual);
                    return;
                }

                try {
                    let tokens = tokenizarFormula(formulaLimpia);
                    let valorParcial = evaluarExpresionAritmetica(tokens, (r) => obtenerValorCelda(r));
                    formatearTextoCelda(td, valorParcial, formatoActual);
                } catch (e) {
                    formatearTextoCelda(td, valorActual, formatoActual);
                }
            } else {
                formatearTextoCelda(td, valorActual, formatoActual);
            }
        }
    });

    barra.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            aplicarValorCelda(celdaActivaRef, barra.value);
            barra.blur();
        }
    });
}

function configurarSelectorFormatoGlobal() {
    let selectFormato = document.getElementById("formato");
    if (!selectFormato) return;

    selectFormato.addEventListener("change", function(e) {
        let nuevoFormato = e.target.value;
        
        let celdasSeleccionadas = document.querySelectorAll(".cell.celda-seleccionada");

        if (celdasSeleccionadas.length === 0) {
            let celdaActiva = document.querySelector(`[data-ref='${celdaActivaRef}']`);
            if (celdaActiva) celdasSeleccionadas = [celdaActiva];
        }

        celdasSeleccionadas.forEach(td => {
            let ref = td.dataset.ref;
            
            if (typeof estadoCeldas !== 'undefined') {
                if (!estadoCeldas[ref]) estadoCeldas[ref] = {};
                estadoCeldas[ref].formato = nuevoFormato;
            }

            let valorActual = obtenerValorCelda(ref);
            formatearTextoCelda(td, valorActual, nuevoFormato);
        });
    });
}

function actualizarSelectorFormato(ref) {
    let selectFormato = document.getElementById("formato");
    if (!selectFormato) return;

    let estado = (typeof estadoCeldas !== 'undefined' && estadoCeldas[ref]) ? estadoCeldas[ref] : null;
    selectFormato.value = (estado && estado.formato) ? estado.formato : "normal";
}

function seleccionarCelda(ref) {
    document.querySelectorAll(".cell").forEach(c => c.classList.remove("celda-activa", "celda-seleccionada"));
    
    celdaActivaRef = ref;
    let label = document.getElementById("celda-activa-label");
    let barra = document.getElementById("barra-formulas");
    let td = document.querySelector(`[data-ref='${ref}']`);

    if (label) label.textContent = ref;
    if (td) td.classList.add("celda-activa");

    if (barra) {
        let estado = typeof estadoCeldas !== 'undefined' ? estadoCeldas[ref] : null;
        barra.value = (estado && estado.formula) ? estado.formula : obtenerValorCelda(ref);
    }
    
    actualizarSelectorFormato(ref);
}

function aplicarValorCelda(ref, valorIngresado) {
    let valorFinal = valorIngresado;

    if (valorIngresado.startsWith("=")) {
        let formulaLimpia = valorIngresado.substring(1);
        let tokens = tokenizarFormula(formulaLimpia);
        valorFinal = evaluarExpresionAritmetica(tokens, (r) => obtenerValorCelda(r));

        if (typeof estadoCeldas !== 'undefined') {
            if (!estadoCeldas[ref]) estadoCeldas[ref] = {};
            estadoCeldas[ref].formula = valorIngresado;
        }

        for (let token of tokens) {
            if (token.tipo === "REF") {
                registrarDependencia(token.valor, ref);
            }
        }
    } else {
        if (typeof estadoCeldas !== 'undefined' && estadoCeldas[ref]) {
            delete estadoCeldas[ref].formula;
        }
    }

    guardarValorCelda(ref, valorFinal);
    
    let td = document.querySelector(`[data-ref='${ref}']`);
    let formatoActual = (typeof estadoCeldas !== 'undefined' && estadoCeldas[ref] && estadoCeldas[ref].formato) ? estadoCeldas[ref].formato : "normal";
    if (td) {
        formatearTextoCelda(td, valorFinal, formatoActual);
    }

    propasarRecalculo(ref, function(refDependiente, valor) {
        let celdaDep = document.querySelector(`[data-ref='${refDependiente}']`);
        let formatoDep = (typeof estadoCeldas !== 'undefined' && estadoCeldas[refDependiente] && estadoCeldas[refDependiente].formato) ? estadoCeldas[refDependiente].formato : "normal";
        if (celdaDep) {
            formatearTextoCelda(celdaDep, valor, formatoDep);
        }
    });
}
// FUNCIONES AUXILIARES DE RANGOS Y SELECCIÓN VISUAL
function mostrarRangoSeleccion(inicio, fin) {
    limpiarSeleccion();
    let inicioInfo = obtenerPosicionCelda(inicio);
    let finInfo = obtenerPosicionCelda(fin);
    if (!inicioInfo || !finInfo) return;

    let filaMin = Math.min(inicioInfo.fila, finInfo.fila);
    let filaMax = Math.max(inicioInfo.fila, finInfo.fila);
    let columnaMin = Math.min(inicioInfo.columna, finInfo.columna);
    let columnaMax = Math.max(inicioInfo.columna, finInfo.columna);

    for (let fila = filaMin; fila <= filaMax; fila++) {
        for (let columna = columnaMin; columna <= columnaMax; columna++) {
            let ref = `${generarLetraColumna(columna)}${fila}`;
            marcarCelda(ref);
        }
    }
}

function marcarCelda(ref) {
    let celda = document.querySelector(`[data-ref="${ref}"]`);
    if (celda) celda.classList.add("celda-seleccionada");
}

function limpiarSeleccion() {
    document.querySelectorAll(".celda-seleccionada").forEach(c => c.classList.remove("celda-seleccionada"));
}

function obtenerPosicionCelda(ref) {
    let resultado = ref.match(/^([A-Z]+)(\d+)$/);
    if (!resultado) return null;
    let letras = resultado[1];
    let fila = parseInt(resultado[2]);
    let columna = 0;
    for (let i = 0; i < letras.length; i++) {
        columna = columna * 26 + (letras.charCodeAt(i) - 64);
    }
    return { fila: fila, columna: columna };
}
// CONTROL DE FORMATOS (NORMAL, MONEDA, PORCENTAJE, DECIMAL)

function formatearTextoCelda(td, valor, tipoFormato = "normal") {
    td.classList.remove("saldo-negativo", "saldo-positivo");

    if (valor === "" || valor === undefined || valor === null) {
        td.textContent = "";
        return;
    }

    if (typeof valor === "string" && valor.startsWith("#")) {
        td.textContent = valor;
        td.classList.add("saldo-negativo");
        return;
    }

    let numero = parseFloat(valor);
    if (!isNaN(numero)) {
        let textoFormateado = valor;

        switch (tipoFormato) {
            case "moneda":
                textoFormateado = "Q " + numero.toLocaleString('es-GT', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                if (numero < 0) td.classList.add("saldo-negativo");
                else td.classList.add("saldo-positivo");
                break;
            case "porcentaje":
                textoFormateado = (numero * 100).toLocaleString('es-GT', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }) + " %";
                break;
            case "decimal":
                textoFormateado = numero.toLocaleString('es-GT', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4
                });
                break;
            default:
                textoFormateado = numero.toString();
                break;
        }
        
        td.textContent = textoFormateado;
    } else {
        td.textContent = valor;
    }
}