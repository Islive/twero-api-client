module.exports = function (postId, lowerThanPostId, options, callback) {
  if (typeof lowerThanPostId === 'function') {
    callback        = lowerThanPostId;
    options         = undefined;
    lowerThanPostId = undefined;
  } else if (typeof lowerThanPostId === 'object') {
    callback        = options;
    options         = lowerThanPostId;
    lowerThanPostId = undefined;
  }

  options = options || {};

  if (lowerThanPostId) {
    options.lowestId = lowerThanPostId;
  }

  return this.get('posts/replies/' + postId, options, callback);
}
