module.exports = function (userId, amount, options, callback) {
  var params = {
    amount: amount
  };

  if (!callback) {
    callback = options;
    options  = false;
  }

  if (options && options.type) {
    params.type = options.type || false;
  }

  if (options && options.name) {
    params.name = options.name || false;
  }

  return this.post('user/tip/' + userId, params, callback);
}
