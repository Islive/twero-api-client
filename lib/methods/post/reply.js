module.exports = function (postId, body, attachment, callback) {
  if (typeof attachment === 'function') {
    callback   = attachment;
    attachment = undefined;
  }

  var postData = { body: body };

  if (attachment) {
    postData.attachment = attachment;
  }

  return this.post('post/reply/' + postId, postData, callback);
}
