function mostrarPopup(id) {
    let popupNode = document.querySelector(id);
    let overlay = popupNode.querySelector("#overlay");
    let closeButton = popupNode.querySelector("#closeButton");
    function openPopup() {
        popupNode.classList.add("active");
    }

    function closePopup() {
        popupNode.classList.remove("active");
    }

    overlay.addEventListener("click", closePopup);
    closeButton.addEventListener("click", closePopup);
    return openPopup;
}

let popup = mostrarPopup("#popup");
document.querySelector("#botonLogIn").addEventListener("click", popup);