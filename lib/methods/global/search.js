module.exports = function (query, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options  = undefined;
  }

  options = options || {};

  options.q = query;

  return this.get('/search', options, callback);
}
