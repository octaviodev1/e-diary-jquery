$('#btn-login').on('click', (e) => {
  const userName = $('#login-name').val();

  localStorage.setItem(
    'loggedInUser',
    JSON.stringify({ id: 1, userName, password: 1234 })
  );
});
