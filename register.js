const validationRegisterInputs = (e) => {
  let nickname = $("#nickname");
  let password = $("#password");

  let errorNickname = $("#errorNickname");
  let errorPassword = $("#errorPassword");

  let valid = [];
  let dataPost = {};

  if (nickname.val() == null || nickname.val() == "") {
    errorNickname.text("Nickname is required");
    valid.push("false");
    nickname.val("");
  } else {
    errorNickname.text("");
    valid.push("true");
    dataPost.nickname = nickname.val();
    nickname.val("");
  }

  if (password.val() == null || password.val() == "") {
    errorPassword.text("Password is required");
    valid.push("false");
    password.val("");
  } else {
    errorPassword.text("");
    valid.push("true");
    dataPost.password = password.val();
    password.val("");
  }

  const checkData = (element) => {
    return element === "true";
  };

  if (valid.every(checkData)) {
    fetch(
      "https://ediary-jquery-default-rtdb.europe-west1.firebasedatabase.app/users.json",
      {
        method: "POST",
        body: JSON.stringify(dataPost),
      }
    );
    returnToLoginPage();
  }
};

const returnToLoginPage = () => {
  document.getElementById("btn-backToLogin").click();
};


$("#formUser").on("submit", function (e) {
  e.preventDefault();
  validationRegisterInputs(e);
});
