module.exports = function (role, username, password, callback) {
  // Role is optional, defaults to 'user'
  if (!callback) {
    callback = password;
    password = username;
    username = role;
    role     = undefined;
  }

  return this.post('user/login', { role: role, username: username, password: password }, callback);
}
