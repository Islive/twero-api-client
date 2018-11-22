/**
 * Remove Event
 * @param id
 * @param callback
 */
module.exports = function (id, callback) {
  return this.delete('/schedule/' + id, callback);
}
