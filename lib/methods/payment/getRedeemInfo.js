module.exports = function (bundleId, callback) {
  return this.get('payment/redeem', { bundle: bundleId }, callback);
}
