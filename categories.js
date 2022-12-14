import { transformData } from "./login.js";
import { updateCategories } from "./login.js";

$("#formCategories").on("keypress", (e) => {
  updateCategories();
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
          )
            .then(userCategory.val(""))
            .then(updateCategories());
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
      for (let i = 0; i < categoriesUserFiltered.length; i++) {
        actualIndexCategories.push(categoriesUserFiltered[i].category);
        actualIdCategories.push(categoriesUserFiltered[i].id);
        temp += "<tr>";
        temp += "<td>" + categoriesUserFiltered[i].category + "</td>";
        temp +=
          "<td> <button type='button' id=" +
          categoriesUserFiltered[i].id +
          " " +
          "class='buttonDelete'>Delete</button> </td>";
        temp +=
          "<td> <button type='button' id=" +
          "category" +
          i +
          " " +
          "class='buttonModifyCategory'>Modify</button> </td></tr>";
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

        $(".notHide").toggleClass("hide");
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
          ).then(updateCategories());
        };

        $("#buttonUpdateCategory").on("click", (e) => {
          if (JSON.parse(localStorage.getItem("isEditing")) == true) {
            if (
              inputAddCategory.val() == null ||
              inputAddCategory.val() == ""
            ) {
              errorAddCategory.text("Please enter a category name");
            } else {
              dataToUpdate["category"] = inputAddCategory.val();
              modifyCategory(idCategory);
              updateCategories();
              inputAddCategory.val("");
              $(".notHide").toggleClass("hide");
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
