module.exports = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options  = undefined;
  }
  return this.get('/user/birthdays', options, callback);
}
