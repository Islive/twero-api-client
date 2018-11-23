module.exports = function (bundleId, extraOptions, callback) {
  if (!callback) {
    callback     = extraOptions;
    extraOptions = undefined;
  }

  if (typeof extraOptions !== 'object') {
    extraOptions = {};
  }

  extraOptions.bundle = bundleId;

  return this.get('payment/start', extraOptions, callback);
}
