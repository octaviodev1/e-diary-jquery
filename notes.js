import { transformData } from "./login.js";
import { updateCountOfNotes } from "./dashboard.js";

// Delete Note
const deleteNote = (noteClass) => {
  let noteId = noteClass.split("buttonDeleteNote ")[1];

  fetch(
    "https://ediary-jquery-default-rtdb.europe-west1.firebasedatabase.app/notes/" +
      noteId +
      ".json",
    {
      method: "DELETE",
    }
  ).then((data) => {
    updateManageNotes();
  });
};

// Note Details
const viewNoteDetails = (noteClass) => {
  if ($(".notHideNote").hasClass("hide")) {
    $(".notHideNote").toggleClass("hide");
  }

  let noteId = noteClass.split("buttonViewNote ")[1];

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

      const userSelectedNote = (note) => {
        return note.id === noteId;
      };

      let selectedNote = userNotes.filter(userSelectedNote);
      let temp = "";
      for (let i = 0; i < selectedNote.length; i++) {
        temp += "<tr>";
        temp += "<th>" + "Note Title" + "</th>";
        temp += "<td>" + selectedNote[i].noteTitle + "</td>";
        temp += "</tr>";

        temp += "<tr>";
        temp += "<th>" + "Note Category" + "</th>";
        temp += "<td>" + selectedNote[i].categoryValue + "</td>";
        temp += "</tr>";

        temp += "<tr>";
        temp += "<th>" + "Note Details" + "</th>";
        temp += "<td>" + selectedNote[i].noteDescription + "</td>";
        temp += "</tr>";
        console.log(selectedNote);
      }
      $("#notesDetailsData").html(temp);
    });
};

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
          "<td> <button type='button' class='buttonViewNote pageButton" +
          " " +
          notesUserFiltered[i].id +
          "'>View</button> </td>";
        temp +=
          "<td> <button type='button' class='buttonDeleteNote pageButton" +
          " " +
          notesUserFiltered[i].id +
          "'>Delete</button> </td></tr>";
      }
      $("#notesData").html(temp);

      document.querySelectorAll(".buttonDeleteNote").forEach((item) => {
        item.addEventListener("click", (e) => {
          deleteNote(item.className);
        });
      });

      document.querySelectorAll(".buttonViewNote").forEach((item) => {
        item.addEventListener("click", (e) => {
          viewNoteDetails(item.className);
        });
      });
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
      updateCountOfNotes();
    });
  }
});

export { updateManageNotes, updateNotes };
