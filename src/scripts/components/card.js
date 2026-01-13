export function createCardElement(cardData, userId, handlers) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".places__item").cloneNode(true);
  
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardInfoButton = cardElement.querySelector(".card__control-button_type_info");
  const cardLikeCount = cardElement.querySelector(".card__like-count");
  
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  
  cardLikeCount.textContent = cardData.likes.length;
  
  const isLiked = cardData.likes.some(like => like._id === userId);
  if (isLiked) {
    cardLikeButton.classList.add("card__like-button_is-active");
  }
  
  if (cardData.owner._id !== userId) {
    cardDeleteButton.remove();
  }
  
  cardImage.addEventListener("click", () => {
    handlers.onPreviewPicture({ name: cardData.name, link: cardData.link });
  });
  
  cardLikeButton.addEventListener("click", () => {
    handlers.onLikeIcon(cardData._id, isLiked, cardLikeButton, cardLikeCount);
  });
  
  if (cardDeleteButton) {
    cardDeleteButton.addEventListener("click", () => {
      handlers.onDeleteClick(cardData._id, cardElement);
    });
  }
  
  if (cardInfoButton) {
    cardInfoButton.addEventListener("click", () => {
      handlers.onInfoClick(cardData._id);
    });
  }
  
  return cardElement;
}

export function deleteCard(cardElement) {
  cardElement.remove();
}

export function likeCard(button) {
  button.classList.toggle("card__like-button_is-active");
}