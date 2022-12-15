import { transformData } from "./login.js";

const updateNotes = (e) => {
  document.getElementById("updateNotes").click();
};

$("#updateNotes").on("click", (e) => {
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

      const userIdCategories = (user) => {
        return user.userId === loggedUserId;
      };

      let categoriesUserFiltered = usersCategories.filter(userIdCategories);

      let temp = "";
      for (let i = 0; i < categoriesUserFiltered.length; i++) {
        temp += "<option>" + categoriesUserFiltered[i].category + "</option>";
      }
      $("#noteSelect").html(temp);
    });
});
updateNotes();

export default updateNotes;
