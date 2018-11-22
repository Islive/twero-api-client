module.exports = function (mediaId, callback) {
  return this.post('media/buy', { media: mediaId }, callback);
}
