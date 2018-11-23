module.exports = function (itemId, receiverId, message, callback) {
  if (typeof message === 'function') {
    callback = message;
    message   = null;
  }

  var data = {
    media   : itemId,
    receiver: receiverId,
    meta    : {
      message: message
    }
  };
  return this.post('media/buy', data, callback);
}
