module.exports = function (sessionParams, callback) {
  this.post('user/session', sessionParams, callback);
}
