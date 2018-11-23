module.exports = function (userId, page, options, callback) {
  if (typeof userId === 'function') {
    callback = userId;
    userId   = null;
  } else if (typeof page === 'function') {
    callback = page;
    page     = undefined;
  } else if (typeof options === callback) {
    callback = options;
    options  = undefined;

    if (typeof page === 'object') {
      options = page;
      page    = undefined;
    }
  }

  options = options || {};

  if (page) {
    options.page = page;
  }

  if (!userId) {
    return this.get('followers', options, callback);
  }

  return this.get('followers/' + userId, options, callback);
}
