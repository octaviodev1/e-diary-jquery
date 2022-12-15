import updateNotes from "./notes.js";
$("#btn-login").on("click", (e) => {
  let loginNickname = $("#login-nickname");
  let loginPassword = $("#login-password");
  fetch(
    "https://ediary-jquery-default-rtdb.europe-west1.firebasedatabase.app/users.json",
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => transformData(data))
    .then((data) => {
      let usersData = data;
      let errorLoginNickname = $("#error-login-nickname");
      let errorLoginPassword = $("#error-login-password");
      let valid = [];

      const userLogging = (user) => {
        return (
          user.nickname == loginNickname.val() &&
          user.password == loginPassword.val()
        );
      };

      if (loginNickname.val() == null || loginNickname.val() == "") {
        errorLoginNickname.text("Please enter a nickname");
        valid.push("false");
      } else {
        errorLoginNickname.text("");
        valid.push("true");
      }

      if (loginPassword.val() == null || loginPassword.val() == "") {
        errorLoginPassword.text("Please enter a password");
        valid.push("false");
      } else {
        errorLoginPassword.text("");
        valid.push("true");
      }

      const checkData = (element) => {
        return element === "true";
      };

      if (valid.every(checkData)) {
        let userLogged = usersData.filter(userLogging);
        if (userLogged.length == 0) {
          errorLoginNickname.text("User don't match");
          errorLoginPassword.text("Password don't match");
          loginNickname.val("");
          loginPassword.val("");
        } else {
          localStorage.setItem("loggedInUser", JSON.stringify(userLogged));
          localStorage.setItem("logged", true);
          loginNickname.val("");
          loginPassword.val("");
          updateCategories();
          updateNotes();
          sendToDashboardPage();
        }
      }

      if (JSON.parse(localStorage.getItem("logged")) == true) {
        $("#btn-loginPage").text("User");
      }
    });
});

const transformData = (data) => {
  const transformedData = [];

  for (const key in data) {
    const dataObj = {
      id: key,
      ...data[key],
    };

    transformedData.push(dataObj);
  }
  return transformedData;
};
const updateCategories = () => {
  document.getElementById("btn-updateCategories").click();
};

const sendToDashboardPage = () => {
  document.getElementById("btn-goToDashboard").click();
};

export { transformData, updateCategories };
