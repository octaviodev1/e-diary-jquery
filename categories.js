import { transformData, updateCategories } from "./login.js";
import { updateNotes, updateManageNotes } from "./notes.js";
import { updateCountOfCategories } from "./dashboard.js";

$("#formCategories").on("keypress", (e) => {
  if (e.which == 13) {
    e.preventDefault();
    return false;
  }
});

$("#formCategories").on("submit", (e) => {
  e.preventDefault();

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

      let actualCategoriesForValidation = [];
      for (let i = 0; i < categoriesUserFiltered.length; i++) {
        actualCategoriesForValidation.push(categoriesUserFiltered[i].category);
      }

      let addCategoryInput = $("#addCategory");
      let errorAddCategory = $("#error-add-category");

      const categoryValidation = (category) => {
        return category === addCategoryInput.val();
      };

      if (JSON.parse(localStorage.getItem("isEditing")) == true) {
        return;
      } else {
        if (addCategoryInput.val() == null || addCategoryInput.val() == "") {
          errorAddCategory.text("Please enter a category name");
        } else if (
          actualCategoriesForValidation.filter(categoryValidation).length > 0
        ) {
          errorAddCategory.text("Category already exists");
        } else {
          errorAddCategory.text("");
          let categoryPost = {};
          let userCategory = $("#addCategory");
          let loggedUserId = JSON.parse(localStorage.getItem("loggedInUser"))[0]
            .id;

          categoryPost.userId = loggedUserId;
          categoryPost.category = userCategory.val();

          fetch(
            "https://ediary-jquery-default-rtdb.europe-west1.firebasedatabase.app/categories.json",
            {
              method: "POST",
              body: JSON.stringify(categoryPost),
            }
          ).then((data) => {
            if ($("#manageCategories").hasClass("hide")) {
              $("#manageCategories").toggleClass("hide");
            } else {
              updateManageNotes();
            }

            userCategory.val("");
            updateCategories();
            updateNotes();

            updateCountOfCategories();
          });
        }
      }
    });
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

      const userIdCategories = (user) => {
        return user.userId === loggedUserId;
      };

      let categoriesUserFiltered = usersCategories.filter(userIdCategories);
      let actualIndexCategories = [];
      let actualIdCategories = [];
      let temp = "";

      if (categoriesUserFiltered.length == 0) {
        $("#manageCategories").toggleClass("hide");
      }

      for (let i = 0; i < categoriesUserFiltered.length; i++) {
        actualIndexCategories.push(categoriesUserFiltered[i].category);
        actualIdCategories.push(categoriesUserFiltered[i].id);
        temp += "<tr>";
        temp += "<td>" + categoriesUserFiltered[i].category + "</td>";
        temp +=
          "<td> <button type='button' id=" +
          categoriesUserFiltered[i].id +
          " " +
          "class='buttonDeleteCategory pageButton'>Delete</button> </td>";
        temp +=
          "<td> <button type='button' id=" +
          "category" +
          i +
          " " +
          "class='buttonModifyCategory pageButton'>Modify</button> </td></tr>";
      }
      $("#categoriesData").html(temp);

      // Button for DELETE Category
      for (let i = 0; i < categoriesUserFiltered.length; i++) {
        $("#" + categoriesUserFiltered[i].id).on("click", (e) => {
          deleteCategory(e.target.id);
        });

        const deleteCategory = (categoryId) => {
          fetch(
            "https://ediary-jquery-default-rtdb.europe-west1.firebasedatabase.app/categories/" +
              categoryId +
              ".json",
            {
              method: "DELETE",
            }
          ).then((resp) => {
            updateCategories();
            updateNotes();
          });
        };
      }

      // Button for MODIFY Category

      $(".buttonModifyCategory").on("click", (e) => {
        let actualIndexCategory = e.target.id.split("category")[1];

        const filteredCategory = actualIndexCategories.filter((item) => {
          return actualIndexCategories.indexOf(item) == actualIndexCategory;
        });

        let loggedUserId = JSON.parse(localStorage.getItem("loggedInUser"))[0]
          .id;

        const dataToUpdate = {
          userId: loggedUserId,
          category: filteredCategory,
        };

        localStorage.setItem("isEditing", true);

        $(".notHideCategories").toggleClass("hide");
        $("#buttonAddCategory").toggleClass("hide");
        $(".changeInEdit").text("Modify Category");
        $("#buttonUpdateCategory").toggleClass("hide");

        let inputAddCategory = $("#addCategory");
        inputAddCategory.val(filteredCategory);
        let errorAddCategory = $("#error-add-category");
        let idCategory;

        for (let i = 0; i < categoriesUserFiltered.length; i++) {
          idCategory = categoriesUserFiltered[actualIndexCategory].id;
        }

        const modifyCategory = (categoryId) => {
          fetch(
            "https://ediary-jquery-default-rtdb.europe-west1.firebasedatabase.app/categories/" +
              categoryId +
              ".json",
            {
              method: "PUT",
              body: JSON.stringify(dataToUpdate),
            }
          ).then((resp) => {
            updateCategories();
            updateNotes();
          });
        };

        $("#buttonUpdateCategory").on("click", (e) => {
          if (JSON.parse(localStorage.getItem("isEditing")) == true) {
            if (
              inputAddCategory.val() == null ||
              inputAddCategory.val() == ""
            ) {
              errorAddCategory.text("Please enter a category name");
            } else {
              errorAddCategory.text("");
              dataToUpdate["category"] = inputAddCategory.val();
              modifyCategory(idCategory);
              updateCategories();
              inputAddCategory.val("");
              $(".notHideCategories").toggleClass("hide");
              $(".changeInEdit").text("Add Category");
              $("#buttonAddCategory").toggleClass("hide");
              $("#buttonUpdateCategory").toggleClass("hide");
              localStorage.setItem("isEditing", false);
            }
          }
        });
      });
    });
});
