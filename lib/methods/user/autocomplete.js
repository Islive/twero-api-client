module.exports = function (query, callback) {
  return this.get('user/autocomplete', { q: query }, callback);
}
