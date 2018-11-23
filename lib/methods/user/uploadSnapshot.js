module.exports = function (snapshot, type, params, callback) {
  if (typeof type === 'function') {
    callback = type;
    params   = null;
    type     = null;
  } else if (typeof params === 'function') {
    callback = params;

    if (typeof type === 'string') {
      params = null
    } else {
      params = type;
      type   = null;
    }
  }

  params = params || {};

  params.snapshot = snapshot;

  if (type) {
    params.type = type;
  }

  return this.post('user/storage/snapshot', params, callback);
}
