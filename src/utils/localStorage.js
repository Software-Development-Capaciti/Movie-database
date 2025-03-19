// src/utils/localStorage.js

export const getUserList = (userId) => {
    const lists = JSON.parse(localStorage.getItem('movieLists') || '{}');
    return lists[userId] || [];
  };
  
  export const addToUserList = (userId, movie) => {
    const lists = JSON.parse(localStorage.getItem('movieLists') || '{}');
    const userList = lists[userId] || [];
    const movieExists = userList.some((m) => m.id === movie.id);
    if (!movieExists) {
      userList.push(movie);
      lists[userId] = userList;
      localStorage.setItem('movieLists', JSON.stringify(lists));
    }
  };
  
  export const removeFromUserList = (userId, movieId) => {
    const lists = JSON.parse(localStorage.getItem('movieLists') || '{}');
    const userList = lists[userId] || [];
    lists[userId] = userList.filter((m) => m.id !== movieId);
    localStorage.setItem('movieLists', JSON.stringify(lists));
  };
  
  export const isMovieInList = (userId, movieId) => {
    const userList = getUserList(userId);
    return userList.some((m) => m.id === movieId);
  };