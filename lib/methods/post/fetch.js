module.exports = function (userId, options, callback) {
  if (typeof userId === 'function') {
    callback = userId;
    options  = undefined;
    userId   = undefined;
  } else if (typeof userId === 'object') {
    callback = options;
    options  = userId;
    userId   = undefined;
  }

  if (typeof options === 'function') {
    callback = options;
    options  = undefined;
  }

  options = options || {};

  if (!userId) {
    return this.get('posts', options, callback);
  }

  return this.get('posts/user/' + userId, options, callback);
}
