module.exports = function (postIds, options, callback) {
  if (!callback) {
    callback = options;
    options  = undefined;
  }

  options = options || {};

  if (postIds instanceof Array) {
    options.postIds = postIds;

    return this.get('posts/selection', options, callback);
  }

  return this.get('post/' + postIds, options, callback);
}
