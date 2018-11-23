module.exports = function (username, email, callback) {
  // Role is optional, defaults to 'user'
  if (!callback) {
    callback = email;
    email    = username;
    username = null;
  }

  if (typeof username === 'string' && username.indexOf('@') > -1) {
    email    = username;
    username = null;
  }

  if (typeof email === 'string' && email.indexOf('@') === -1) {
    username = email;
    email    = null;
  }

  return this.post('user/forgot-password', { username: username, email: email }, callback);
}
