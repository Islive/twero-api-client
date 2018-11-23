module.exports = function (options, callback) {
  options = options || {};

  return this.get('user/suggested/fuddies', options, callback);
}
