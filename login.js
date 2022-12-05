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

      let exampl = usersData.filter(function (obj) {
        return (
          obj.nickname == loginNickname.val() &&
          obj.password == loginPassword.val()
        );
      });
      console.log(exampl);
      /*
      const example2 = (obj) => {
        console.log(loginNickname.val());
        console.log(obj);
        if ("nickname" in obj == loginNickname.val()) {
          return true;
        } else {
          return false;
        }
      };
      let example = usersData.filter(example2);
      console.log(example);
      
      for (let i = 0; i < usersData.length; i++) {
        errorLoginNickname.text("");
        errorLoginPassword.text("");
        
        if (usersData[i].nickname == loginNickname.val()) {
          if (usersData[i].password == loginPassword.val()) {
            localStorage.setItem("loggedInUser", JSON.stringify(usersData[i]));
            localStorage.setItem("logged", true);
            sendToDashboardPage();
            break;
          } else {
            errorLoginPassword.text("Incorrect password");
            loginPassword.val("");
          }
        } else {
          errorLoginNickname.text("User not found");
          errorLoginPassword.text("Incorrect password");
          loginNickname.val("");
          loginPassword.val("");
        
      }}
      */
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

const sendToDashboardPage = () => {
  document.getElementById("btn-goToDashboard").click();
};
