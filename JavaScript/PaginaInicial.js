function mostrarPopup(id) {
    // Selecciona el elemento del DOM que corresponde al popup usando el ID proporcionado.
    let popupNode = document.querySelector(id);

    // Dentro del popup, selecciona el elemento con el ID "overlay".
    // Este elemento se utiliza como fondo oscuro que aparece detrás del popup.
    let overlay = popupNode.querySelector("#overlay");

    // Dentro del popup, selecciona el botón de cierre con el ID "closeButton".
    // Este botón permite al usuario cerrar el popup.
    let closeButton = popupNode.querySelector("#closeButton");

    // Define una función para abrir el popup.
    // Agrega la clase "active" al elemento del popup, lo que probablemente lo hace visible.
    function openPopup() {
        popupNode.classList.add("active");
    }

    // Define una función para cerrar el popup.
    // Elimina la clase "active" del elemento del popup, ocultándolo.
    function closePopup() {
        popupNode.classList.remove("active");
    }

    // Agrega un evento al overlay para que, al hacer clic en él, se cierre el popup.
    overlay.addEventListener("click", closePopup);

    // Agrega un evento al botón de cierre para que, al hacer clic en él, se cierre el popup.
    closeButton.addEventListener("click", closePopup);

    // Retorna la función `openPopup` para que pueda ser utilizada externamente.
    return openPopup;
}

// Llama a la función `mostrarPopup` pasando el ID del popup como argumento.
// Esto configura el popup y devuelve la función `openPopup`.
let popup = mostrarPopup("#popup");

// Selecciona el botón con el ID "botonLogIn" y agrega un evento de clic.
// Cuando se hace clic en este botón, se ejecuta la función `popup` (que abre el popup).
document.querySelector("#botonLogIn").addEventListener("click", popup);

// Función para abrir la pagina de invitado
function abrirInvitado(){
    window.location.href = "Html/NuevaRondaInvitado.html"
}