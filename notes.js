import { transformData } from "./login.js";

const updateManageNotes = (e) => {
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

      let notesUserFiltered = userNotes.filter(userIdNotes);
      let temp = "";
      for (let i = 0; i < notesUserFiltered.length; i++) {
        temp += "<tr>";
        temp += "<td>" + notesUserFiltered[i].noteTitle + "</td>";
        temp += "<td>" + notesUserFiltered[i].categoryValue + "</td>";
        temp +=
          "<td> <button type='button' class='buttonView'>View</button> </td>";
        temp +=
          "<td> <button type='button' class='buttonDelete'>Delete</button> </td></tr>";
      }
      $("#notesData").html(temp);
      console.log(notesUserFiltered);
    });
};

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
          categoriesUserFiltered[i].userId +
          ">" +
          categoriesUserFiltered[i].category +
          "</option>";
      }
      $("#noteSelect").html(temp);
    });
});

$("#addNote").on("click", (e) => {
  let categoryName = $("#noteSelect");
  let noteTitle = $("#noteTitle");
  let noteDescription = $("#textareaNoteDescription");

  let errorNoteTitle = $("#error-noteTitle");
  let errorNoteDescription = $("#error-noteDescription");

  let categoryValue = categoryName.find(":selected").val();
  let categoryUserId = categoryName.find(":selected").attr("id");

  let notePost = {};

  let valid = [];

  if (noteTitle.val() == null || noteTitle.val() == "") {
    errorNoteTitle.text("Please enter a Title");
    valid.push("false");
  } else {
    valid.push("true");
    notePost.categoryValue = categoryValue;
    notePost.userId = categoryUserId;
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
    ).then((data) => {
      updateManageNotes();
      updateNotes();
    });
  }
});

export { updateManageNotes, updateNotes };
