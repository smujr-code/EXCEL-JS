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
//desplazamiento entre celdas con teclados
let esFlecha = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key);
    let esEnter = e.key === "Enter";