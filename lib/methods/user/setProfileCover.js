module.exports = function (attachment, callback) {
  return this.post('attachment/profile', { attachment: attachment }, callback);
}
