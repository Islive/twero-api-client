module.exports = function (section, identifier, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  return this.get('/rating/users/'+ section +'/' + identifier, options, callback);
}
