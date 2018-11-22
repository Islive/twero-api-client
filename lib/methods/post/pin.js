module.exports = function (postId, onNewsPage, callback) {
  var pinUrl = 'post/pin/';

  if (typeof onNewsPage === 'function') {
    callback   = onNewsPage;
    onNewsPage = undefined;
  }

  if (onNewsPage) {
    pinUrl += 'news/';
  }

  return this.get(pinUrl + postId, callback);
}
