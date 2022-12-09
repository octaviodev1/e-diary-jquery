import { transformData } from "./login.js";
import { updateCategories } from "./login.js";

$("#formCategories").on("keypress", (e) => {
  updateCategories();
});

$("#formCategories").on("submit", (e) => {
  e.preventDefault();

  let addCategoryInput = $("#addCategory");
  let errorAddCategory = $("#error-add-category");

  if (addCategoryInput.val() == null || addCategoryInput.val() == "") {
    errorAddCategory.text("Please enter a category name");
  } else {
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
    updateCategories();
  }
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
      let temp = "";
      for (let i = 0; i < categoriesUserFiltered.length; i++) {
        temp += "<tr>";
        temp += "<td>" + categoriesUserFiltered[i].category + "</td>";
        temp +=
          "<td> <button type='button' id=" +
          categoriesUserFiltered[i].id +
          " " +
          "class='buttonDelete'>Delete</button> </td>";
        temp +=
          "<td> <button type='button' class='buttonModifyCategory'>Modify</button> </td></tr>";
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
      // $(".buttonModifyCategory").on("click", (e) => {
      //   $(".notHide").toggleClass("hide");
      //   $("#buttonAddCategory").val("Update Category");
      //   $(".changeInEdit").text("Modify Category");

      // });
    });
});
