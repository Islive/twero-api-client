module.exports = function (bundleId, code, options, callback) {
  if (!callback) {
    callback = options;
    options  = {};
  }

  options = options || {};

  options.bundle = bundleId;
  options.redeem = code;

  return this.post('payment/redeem', options, callback);
}
