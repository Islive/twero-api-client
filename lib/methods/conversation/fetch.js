module.exports = function (userId, page, params, callback) {
  if (typeof page === 'function') {
    callback = page;
    page     = undefined;
    params  = undefined;
  } else if (typeof params === 'function') {
    callback = params;
    if (typeof page === 'object') {
      params = page;
      page    = undefined;
    } else {
      params = undefined;
    }
  }

  page    = page || 1;
  params = params || {};

  params.page = page;

  return this.get('conversation/' + userId, params, callback);
}
