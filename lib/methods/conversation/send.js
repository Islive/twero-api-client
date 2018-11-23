module.exports = function (userId, message, attachment, callback) {
  if (typeof attachment === 'function') {
    callback = attachment;
    attachment = null;
  }

  var data = { message: message };

  if (attachment) {
    data.attachment = attachment;
  }

  return this.post('conversation/' + userId, data, callback);
}
