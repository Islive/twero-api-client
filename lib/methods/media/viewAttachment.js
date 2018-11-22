module.exports = function (data, callback) {
  // Legacy-support, media is the ID and not the object
  if (typeof data === 'number') {
    const container = data;
    data = {
      postId : container,
    };
  }

  return this.get('media/attachment', data, callback);
}
