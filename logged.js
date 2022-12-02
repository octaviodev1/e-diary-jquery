$("#btn-logout").on("click", (e) => {
    localStorage.clear();
    document.getElementById("btn-backToHome").click();
    
});
