module.exports = function (hash, callback) {
  return this.post('user/login/' + hash, callback);
}
