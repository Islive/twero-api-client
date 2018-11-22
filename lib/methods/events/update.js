/**
 * Update Event
 * @param data
 * @param callback
 */
module.exports = function (data, callback) {
  return this.put('/schedule/' + data.id, data, callback)
}