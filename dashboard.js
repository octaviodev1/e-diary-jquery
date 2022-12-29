import { transformData } from "./login.js";

const updateCountOfNotes = (e) => {
  fetch(
    "https://ediary-jquery-default-rtdb.europe-west1.firebasedatabase.app/notes.json",
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => transformData(data))
    .then((data) => {
      let userNotes = data;

      let loggedUserId = JSON.parse(localStorage.getItem("loggedInUser"))[0].id;

      const userIdNotes = (user) => {
        return user.userId === loggedUserId;
      };

      let countOfNotes = userNotes.filter(userIdNotes).length;
      $("#totalNotes").text(countOfNotes);
    });
};

const updateCountOfCategories = (e) => {
  fetch(
    "https://ediary-jquery-default-rtdb.europe-west1.firebasedatabase.app/categories.json",
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => transformData(data))
    .then((data) => {
      let userCategories = data;

      let loggedUserId = JSON.parse(localStorage.getItem("loggedInUser"))[0].id;

      const userIdNotes = (user) => {
        return user.userId === loggedUserId;
      };
      let countOfCategories = userCategories.filter(userIdNotes).length;
      $("#totalCategories").text(countOfCategories);
    });
};

export { updateCountOfNotes, updateCountOfCategories };
