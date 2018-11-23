module.exports = function (search, callback) {
  this.get('location', { city: search }, callback);
}
