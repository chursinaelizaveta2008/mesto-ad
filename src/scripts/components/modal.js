let currentCloseHandler = null;

const handleEscUp = (evt) => {
  if (evt.key === "Escape") {
    const activePopup = document.querySelector(".popup_is-opened");
    closeModalWindow(activePopup);
    if (currentCloseHandler) {
      currentCloseHandler();
      currentCloseHandler = null;
    }
  }
};

export const openModalWindow = (modalWindow, onCloseCallback = null) => {
  modalWindow.classList.add("popup_is-opened");
  document.addEventListener("keyup", handleEscUp);
  currentCloseHandler = onCloseCallback;
};

export const closeModalWindow = (modalWindow) => {
  modalWindow.classList.remove("popup_is-opened");
  document.removeEventListener("keyup", handleEscUp);
  if (currentCloseHandler) {
    currentCloseHandler = null;
  }
};

export const setCloseModalWindowEventListeners = (modalWindow, onCloseCallback = null) => {
  const closeButtonElement = modalWindow.querySelector(".popup__close");
  closeButtonElement.addEventListener("click", () => {
    closeModalWindow(modalWindow);
    if (onCloseCallback) {
      onCloseCallback();
    }
  });

  modalWindow.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("popup")) {
      closeModalWindow(modalWindow);
      if (onCloseCallback) {
        onCloseCallback();
      }
    }
  });
};