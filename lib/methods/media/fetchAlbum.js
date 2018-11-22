module.exports = function (username, albumId, callback) {
  return this.get('media/' + username + '/' + albumId, callback);
}