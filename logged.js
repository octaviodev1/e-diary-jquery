$("#btn-logout").on("click", (e) => {
  localStorage.clear();
  document.getElementById("btn-backToHome").click();
  localStorage.setItem("logged", false);

  if (JSON.parse(localStorage.getItem("logged")) == false) {
    $("#btn-loginPage").text("Login");
  }

  $("#noteSelect").html("");
});
