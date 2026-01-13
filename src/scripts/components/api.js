// Конфигурация API
const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/apf-cohort-202",
  headers: {
    authorization: "9b2e817f-06a1-4d10-b86b-644d0ad0e5e1",
    "Content-Type": "application/json",
  },
};

// Проверка ответа сервера
const getResponseData = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

// 1. Получение данных пользователя
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(getResponseData);
};

// 2. Получение списка карточек
export const getCardList = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(getResponseData);
};

// 3. Обновление данных пользователя
export const setUserInfo = ({ name, about }) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name,
      about,
    }),
  }).then(getResponseData);
};

// 4. Обновление аватара
export const updateAvatar = (avatar) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ avatar }),
  }).then(getResponseData);
};

// 5. Добавление новой карточки
export const addCard = ({ name, link }) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({ name, link }),
  }).then(getResponseData);
};

// 6. Удаление карточки
export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(getResponseData);
};

// 7. Постановка/снятие лайка
export const changeLikeCardStatus = (cardId, isLiked) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: isLiked ? "DELETE" : "PUT",
    headers: config.headers,
  }).then(getResponseData);
};