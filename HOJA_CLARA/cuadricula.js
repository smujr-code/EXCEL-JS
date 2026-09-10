/*Estructura y presentación de la cuadrícula*/

const TOTAL_FILAS = 15;
const TOTAL_COLUMNAS = 10;
const estadoCeldas = {};

function generarLetraColumna(indice) {
    return String.fromCharCode(64 + indice);
}

function construirCabeceraTabla() {
    const thead = document.createElement("thead");
    const filaEncabezado = document.createElement("tr");
    
    const thEsquina = document.createElement("th");
    thEsquina.style.position = "sticky";
    thEsquina.style.top = "0";
    thEsquina.style.left = "0";
    thEsquina.style.zIndex = "4";
    thEsquina.style.backgroundColor = "#f1f3f4";
    filaEncabezado.appendChild(thEsquina);

    for (let j = 1; j <= TOTAL_COLUMNAS; j++) {
        const th = document.createElement("th");
        th.textContent = generarLetraColumna(j);
        th.style.position = "sticky";
        th.style.top = "0";
        th.style.zIndex = "2";
        th.style.backgroundColor = "#f1f3f4";
        filaEncabezado.appendChild(th);
    }
    thead.appendChild(filaEncabezado);
    return thead;
}

function construirCelda(i, j) {
    const td = document.createElement("td");
    const letraCol = generarLetraColumna(j);
    const refCelda = `${letraCol}${i}`;

    td.className = "cell";
    td.dataset.ref = refCelda;
    td.textContent = (estadoCeldas[refCelda] && estadoCeldas[refCelda].valor) ? estadoCeldas[refCelda].valor : "";
    return td;

    td.addEventListener("click", function() {
        seleccionarCelda(refCelda);
        let barra = document.getElementById("barra-formulas");
        if (barra) barra.focus();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const contenedor = document.getElementById("grid-container");
    if (!contenedor) return;

    const tabla = document.createElement("table");
    tabla.appendChild(construirCabeceraTabla());

    const tbody = document.createElement("tbody");
    for (let i = 1; i <= TOTAL_FILAS; i++) {
        const fila = document.createElement("tr");
        
        const thFila = document.createElement("th");
        thFila.textContent = i;
        thFila.style.position = "sticky";
        thFila.style.left = "0";
        thFila.style.zIndex = "3";
        thFila.style.backgroundColor = "#f1f3f4";
        fila.appendChild(thFila);

        for (let j = 1; j <= TOTAL_COLUMNAS; j++) {
            fila.appendChild(construirCelda(i, j));
        }
        tbody.appendChild(fila);
    }
    tabla.appendChild(tbody);
    contenedor.appendChild(tabla);
});

/*selección de celdas activas barra de formulas*/

let celdaActivaRef = "A1";

function seleccionarCelda(ref) {
    document.querySelectorAll(".cell").forEach(c => c.classList.remove("celda-activa"));
    celdaActivaRef = ref;
    let label = document.getElementById("celda-activa-label");
    let barra = document.getElementById("barra-formulas");
    let td = document.querySelector(`[data-ref='${ref}']`);

    if (label) label.textContent = ref;
    if (td) td.classList.add("celda-activa");
    if (barra) {
        let estado = estadoCeldas[ref];
        barra.value = (estado && estado.valor) ? estado.valor : "";
    }
}

// Guardamos los valores de las celdas y los mostramos al cargar

function guardarValorCelda(ref, valor) {
    if (!estadoCeldas[ref]) estadoCeldas[ref] = {};
    estadoCeldas[ref].valor = valor;
    try {
        localStorage.setItem("hojaClaraData", JSON.stringify(estadoCeldas));
    } catch (e) {
        console.error("Error al guardar", e);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    let barra = document.getElementById("barra-formulas");
    if (barra) {
        barra.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                let valorIngresado = barra.value;
                guardarValorCelda(celdaActivaRef, valorIngresado);
                let td = document.querySelector(`[data-ref='${celdaActivaRef}']`);
                if (td) td.textContent = valorIngresado;
                barra.blur();
            }
        });
    }
    // Seleccionar la celda inicial al cargar
    seleccionarCelda("A1");
});