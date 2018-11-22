module.exports = function (userId, limit, callback) {
  if (!callback) {
    callback = limit;
    limit    = undefined;
  }

  var params = {};
  if (limit) {
    params.amount = limit;
  }

  return this.get('media/following/' + userId, params, callback);
}
