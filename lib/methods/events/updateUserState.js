/**
 * Update User state of an Event
 * @param data
 * @param callback
 */
module.exports = function (data, callback) {
  return this.put('/schedule/user/state', data, callback)
}
