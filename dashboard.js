$('#btn-dashboard-login').on('click', (e) => {
  console.log(JSON.parse(localStorage.getItem('loggedInUser')));
});
