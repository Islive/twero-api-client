module.exports = function (hash, password, callback) {
  return this.post('user/reset-password', { hash: hash, password: password }, callback);
}
