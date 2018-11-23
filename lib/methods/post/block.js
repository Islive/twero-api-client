module.exports = function (userId, callback) {
  this.post('block/' + userId, {}, callback);
}
