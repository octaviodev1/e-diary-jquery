import { transformData } from "./login.js";

$("#formCategories").on("submit", (e) => {
  e.preventDefault();
  let categoryPost = {};
  let userCategory = $("#addCategory");
  let loggedUserId = JSON.parse(localStorage.getItem("loggedInUser"))[0].id;

  categoryPost.userId = loggedUserId;
  categoryPost.category = userCategory.val();

  fetch(
    "https://ediary-jquery-default-rtdb.europe-west1.firebasedatabase.app/categories.json",
    {
      method: "POST",
      body: JSON.stringify(categoryPost),
    }
  ).then(userCategory.val(""));
});

$("#btn-updateCategories").on("click", (e) => {
  fetch(
    "https://ediary-jquery-default-rtdb.europe-west1.firebasedatabase.app/categories.json",
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => transformData(data))
    .then((data) => {
      let usersCategories = data;

      let loggedUserId = JSON.parse(localStorage.getItem("loggedInUser"))[0].id;
      console.log(loggedUserId);

      const userIdCategories = (user) => {
        return user.userId == loggedUserId;
      };
      console.log(usersCategories.filter(userIdCategories));
    });
});

$(window).on("load", document.getElementById("btn-updateCategories").click());
