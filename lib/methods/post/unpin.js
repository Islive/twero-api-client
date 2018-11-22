module.exports = function (postId, onNewsPage, callback) {
  var unpinUrl = 'post/unpin/';

  if (typeof onNewsPage === 'function') {
    callback   = onNewsPage;
    onNewsPage = undefined;
  }

  if (onNewsPage) {
    unpinUrl += 'news/';
  }

  return this.get(unpinUrl + postId, callback);
}
