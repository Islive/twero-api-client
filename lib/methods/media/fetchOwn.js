module.exports = function (media, callback) {
  if (typeof media === 'function') {
    callback = media;
    media    = undefined;
  }

  // Legacy-support, media is the ID and not the object
  if (typeof media === 'number') {
    const container = media;
    media = {
      id : container,
    };
  }

  return this.get('media', media, callback);
}
