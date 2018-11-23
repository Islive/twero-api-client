module.exports = function (params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params   = {};
  }

  return this.get('conversation/all', params, callback);
}
