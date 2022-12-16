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
        temp +=
          "<option id=" +
          categoriesUserFiltered[i].id +
          ">" +
          categoriesUserFiltered[i].category +
          "</option>";
      }
      $("#noteSelect").html(temp);
    });
});
updateNotes();

$("#addNote").on("click", (e) => {
  let categoryName = $("#noteSelect");
  let noteTitle = $("#noteTitle");
  let noteDescription = $("#textareaNoteDescription");

  let errorNoteTitle = $("#error-noteTitle");
  let errorNoteDescription = $("#error-noteDescription");

  let categoryId = categoryName.find(":selected").attr("id");

  let notePost = {};

  let valid = [];

  if (noteTitle.val() == null || noteTitle.val() == "") {
    errorNoteTitle.text("Please enter a Title");
    valid.push("false");
  } else {
    valid.push("true");
    notePost.categoryId = categoryId;
    notePost.noteTitle = noteTitle.val();
    errorNoteTitle.text("");
    noteTitle.val("");
  }

  if (noteDescription.val() == null || noteDescription.val() == "") {
    errorNoteDescription.text("Please enter a Description");
    valid.push("false");
  } else {
    valid.push("true");
    notePost.noteDescription = noteDescription.val();
    errorNoteDescription.text("");
    noteDescription.val("");
  }

  const checkData = (element) => {
    return element === "true";
  };

  if (valid.every(checkData)) {
    fetch(
      "https://ediary-jquery-default-rtdb.europe-west1.firebasedatabase.app/notes.json",
      {
        method: "POST",
        body: JSON.stringify(notePost),
      }
    );
  }
});

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
    console.log(userNotes);
  });

export default updateNotes;
