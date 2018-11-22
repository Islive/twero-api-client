/**
 * Find an Event
 * @param options
 * @param callback
 */
module.exports = function (options, callback) {
  return this.get('/schedule/', options, callback);
}
