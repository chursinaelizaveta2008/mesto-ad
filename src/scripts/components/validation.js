function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = document.querySelector(`#${inputElement.id}-error`);
  
  if (errorElement) {
    inputElement.classList.add(settings.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(settings.errorClass);
  }
}

function hideInputError(formElement, inputElement, settings) {
  const errorElement = document.querySelector(`#${inputElement.id}-error`);
  
  if (errorElement) {
    inputElement.classList.remove(settings.inputErrorClass);
    errorElement.classList.remove(settings.errorClass);
    errorElement.textContent = '';
  }
}

function checkInputValidity(formElement, inputElement, settings) {
  if (inputElement.validity.patternMismatch && inputElement.dataset.errorMessage) {
    showInputError(formElement, inputElement, inputElement.dataset.errorMessage, settings);
  } else if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
}

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

function enableSubmitButton(buttonElement, settings) {
  buttonElement.classList.remove(settings.inactiveButtonClass);
  buttonElement.disabled = false;
}

function disableSubmitButton(buttonElement, settings) {
  buttonElement.classList.add(settings.inactiveButtonClass);
  buttonElement.disabled = true;
}

function toggleButtonState(inputList, buttonElement, settings) {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, settings);
  } else {
    enableSubmitButton(buttonElement, settings);
  }
}

function setEventListeners(formElement, settings) {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  if (!buttonElement) {
    console.error('Кнопка не найдена в форме');
    return;
  }
  
  toggleButtonState(inputList, buttonElement, settings);
  
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
}

function clearValidation(formElement, settings) {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });
  
  if (buttonElement) {
    disableSubmitButton(buttonElement, settings);
  }
}

function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  
  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
    
    setEventListeners(formElement, settings);
  });
}

export { enableValidation, clearValidation };