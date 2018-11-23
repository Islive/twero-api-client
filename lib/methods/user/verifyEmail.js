module.exports = function (hash, callback) {
  return this.post('user/verify-email', { hash: hash }, callback);
}
