module.exports = function (postId, callback) {
  return this.post('post/delete/' + postId, callback);
}
