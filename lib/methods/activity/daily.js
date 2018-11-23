module.exports = function (options, callback) {
  options = options || {};

  return this.get('activity/daily', options, callback);
}
