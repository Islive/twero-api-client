/**
 * Create new Event
 * @param data
 * @param callback
 */
module.exports = function (data, callback) {
  this.post('/schedule', data, callback);
}
