module.exports = function (userId, callback) {
  return this.post('follow', { userId: userId }, callback);
}
