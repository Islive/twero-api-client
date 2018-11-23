module.exports = function (event, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options  = {};
  }

  options.event = event;

  return this.get('/activities/history', options, callback);
}
