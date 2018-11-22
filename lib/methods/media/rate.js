module.exports = function (mediaId, score, callback) {
  return this.post('media/rating/'+ mediaId, { score: score }, callback);
}
