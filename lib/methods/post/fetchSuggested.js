module.exports = function (options, callback) {
  options = options || {};

  return this.get('post/suggested', options, callback);
}
