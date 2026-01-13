/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { 
  getUserInfo, 
  getCardList, 
  setUserInfo, 
  updateAvatar, 
  addCard, 
  deleteCard, 
  changeLikeCardStatus 
} from "./components/api.js";
import { createCardElement } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";

const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input_type_avatar");

const removeCardModalWindow = document.querySelector(".popup_type_remove-card");
const removeCardForm = removeCardModalWindow.querySelector(".popup__form");
const removeCardButton = removeCardForm.querySelector(".popup__button");

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible"
};

let userId = null;
let cardToDelete = null;
let cardElementToDelete = null;

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const createInfoString = (term, description) => {
  const template = document.querySelector("#popup-info-definition-template");
  const infoElement = template.content.cloneNode(true);
  
  const termElement = infoElement.querySelector(".popup__info-term");
  const descriptionElement = infoElement.querySelector(".popup__info-description");
  
  termElement.textContent = term;
  descriptionElement.textContent = description;
  
  return infoElement;
};

const createUserBadge = (user) => {
  const template = document.querySelector("#popup-info-user-preview-template");
  const userElement = template.content.cloneNode(true);
  const badgeElement = userElement.querySelector(".popup__list-item");
  
  badgeElement.style.backgroundImage = `url(${user.avatar})`;
  badgeElement.title = user.name;
  
  return userElement;
};

const handleInfoClick = (cardId) => {
  const cardInfoModalWindow = document.querySelector(".popup_type_info");
  const cardInfoModalTitle = cardInfoModalWindow.querySelector(".popup__title");
  const cardInfoModalInfoList = cardInfoModalWindow.querySelector(".popup__info");
  const cardInfoModalUsersTitle = cardInfoModalWindow.querySelector(".popup__text");
  const cardInfoModalUsersList = cardInfoModalWindow.querySelector(".popup__list");
  
  getCardList()
    .then((cards) => {
      const cardData = cards.find(card => card._id === cardId);
      
      if (!cardData) {
        console.error("Карточка не найдена");
        return;
      }
      
      cardInfoModalTitle.textContent = "Информация о карточке";
      cardInfoModalInfoList.innerHTML = "";
      cardInfoModalUsersTitle.textContent = "";
      cardInfoModalUsersList.innerHTML = "";
      
      const infoItems = [
        { term: "Описание:", description: cardData.name },
        { term: "Дата создания:", description: formatDate(new Date(cardData.createdAt)) },
        { term: "Владелец:", description: cardData.owner.name },
        { term: "Количество лайков:", description: cardData.likes.length.toString() }
      ];
      
      infoItems.forEach(item => {
        cardInfoModalInfoList.appendChild(
          createInfoString(item.term, item.description)
        );
      });
      
      if (cardData.likes.length > 0) {
        cardInfoModalUsersTitle.textContent = "Лайкнули:";
        
        cardData.likes.forEach(user => {
          const listItem = document.createElement("li");
          listItem.classList.add("popup__list-item");
          listItem.textContent = user.name;
          
          if (user.name.length > 15) {
            listItem.textContent = user.name.substring(0, 12) + "...";
          }
          
          cardInfoModalUsersList.appendChild(listItem);
        });
      }
      
      openModalWindow(cardInfoModalWindow);
    })
    .catch((err) => {
      console.error("Ошибка загрузки данных карточки:", err);
    });
};

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  
  const submitButton = profileForm.querySelector(".popup__button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";
  
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
      profileForm.reset();
    })
    .catch((err) => {
      console.log("Ошибка обновления профиля:", err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
};

const handleAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  
  const submitButton = avatarForm.querySelector(".popup__button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";
  
  updateAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
      avatarForm.reset();
    })
    .catch((err) => {
      console.log("Ошибка обновления аватара:", err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  
  const submitButton = cardForm.querySelector(".popup__button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Создание...";
  
  addCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((cardData) => {
      placesWrap.prepend(
        createCardElement(cardData, userId, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: (cardId, isLiked, button, countElement) => handleLikeCard(cardId, isLiked, button, countElement),
          onDeleteClick: handleDeleteClick,
          onInfoClick: handleInfoClick,
        })
      );
      closeModalWindow(cardFormModalWindow);
      cardForm.reset();
    })
    .catch((err) => {
      console.log("Ошибка добавления карточки:", err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
};

const handleLikeCard = (cardId, isLiked, likeButton, likeCountElement) => {
  changeLikeCardStatus(cardId, isLiked)
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like-button_is-active");
      likeCountElement.textContent = updatedCard.likes.length;
    })
    .catch((err) => {
      console.log("Ошибка лайка:", err);
    });
};

const handleDeleteClick = (cardId, cardElement) => {
  cardToDelete = cardId;
  cardElementToDelete = cardElement;
  openModalWindow(removeCardModalWindow);
};

const handleRemoveCardSubmit = (evt) => {
  evt.preventDefault();
  
  const originalText = removeCardButton.textContent;
  removeCardButton.textContent = "Удаление...";
  
  deleteCard(cardToDelete)
    .then(() => {
      cardElementToDelete.remove();
      closeModalWindow(removeCardModalWindow);
      cardToDelete = null;
      cardElementToDelete = null;
    })
    .catch((err) => {
      console.log("Ошибка удаления карточки:", err);
    })
    .finally(() => {
      removeCardButton.textContent = originalText;
    });
};

const resetDeleteCardState = () => {
  cardToDelete = null;
  cardElementToDelete = null;
};

profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);
removeCardForm.addEventListener("submit", handleRemoveCardSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModalWindow(profileFormModalWindow);
  clearValidation(profileForm, validationSettings);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  openModalWindow(avatarFormModalWindow);
  clearValidation(avatarForm, validationSettings);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  openModalWindow(cardFormModalWindow);
  clearValidation(cardForm, validationSettings);
});

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    userId = userData._id;
    
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    
    cards.forEach((cardData) => {
      placesWrap.append(
        createCardElement(cardData, userId, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: (cardId, isLiked, button, countElement) => handleLikeCard(cardId, isLiked, button, countElement),
          onDeleteClick: handleDeleteClick,
          onInfoClick: handleInfoClick,
        })
      );
    });
  })
  .catch((err) => {
    console.log("Ошибка загрузки данных:", err);
  });

enableValidation(validationSettings);

const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  if (popup === removeCardModalWindow) {
    setCloseModalWindowEventListeners(popup, resetDeleteCardState);
  } else {
    setCloseModalWindowEventListeners(popup);
  }
});