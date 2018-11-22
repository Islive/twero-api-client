module.exports = function (filters, callback) {
  if (!callback) {
    callback = filters;
    filters  = null;
  }

  return this.get('media/search', filters, callback);
}
