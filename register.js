document.forms.register.noValidate = true;
const validationRegisterInputs = (e) => {
  let nickname = $("#register-nickname");
  let email = $("#email-register");
  let mobileNumber = $("#register-mobile-Number");
  let password = $("#register-password");
  let confirmPassword = $("#register-confirm-password");

  let errorNickname = $("#error-register-nickname");
  let errorEmail = $("#error-register-email");
  let errorMobileNumber = $("#error-register-mobile");
  let errorPassword = $("#error-register-password");
  let errorConfirmPassword = $("#error-register-confirm-password");

  let valid = [];
  let dataPost = {};

  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  // Nickname Validation

  if (nickname.val() == null || nickname.val() == "") {
    errorNickname.text("Nickname is required");
    valid.push("false");
    nickname.val("");
  } else {
    errorNickname.text("");
    valid.push("true");
    dataPost.nickname = nickname.val();
  }
  // Email Validation

  if (email.val() == null || email.val() == "") {
    errorEmail.text("Email is required");
    valid.push("false");
    email.val("");
  } else if (!email.val().match(validRegex)) {
    errorEmail.text("Email is not valid");
    valid.push("false");
    email.val("");
  } else {
    errorEmail.text("");
    valid.push("true");
    dataPost.email = email.val();
  }

  // Mobile Number validation

  if (mobileNumber.val() == null || mobileNumber.val() == "") {
    errorMobileNumber.text("Mobile Number is required");
    valid.push("false");
    mobileNumber.val("");
  } else if (mobileNumber.val().length < 9) {
    errorMobileNumber.text("Mobile Number is not valid");
    valid.push("false");
    mobileNumber.val("");
  } else {
    errorMobileNumber.text("");
    valid.push("true");
    dataPost.mobile = mobileNumber.val();
  }

  // Confirm Password Validation

  if (confirmPassword.val() == null || confirmPassword.val() == "") {
    errorConfirmPassword.text("Confirmation required");
    valid.push("false");
    confirmPassword.val("");
  } else if (confirmPassword.val() !== password.val()) {
    errorConfirmPassword.text("Password don't match");
    valid.push("false");
    confirmPassword.val("");
  } else {
    errorConfirmPassword.text("");
    valid.push("true");
    confirmPassword.val("");
  }

  // Password Validation

  if (password.val() == null || password.val() == "") {
    errorPassword.text("Password is required");
    valid.push("false");
    password.val("");
  } else if (password.val().length < 1) {
    errorPassword.text("Password is not valid");
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
    nickname.val("");
    email.val("");
    mobileNumber.val("");
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
