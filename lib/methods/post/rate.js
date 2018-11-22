module.exports = function (postId, score, callback) {
  return this.post('/post/rating/'+ postId, { score: score }, callback);
}
