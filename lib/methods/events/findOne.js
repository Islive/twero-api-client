/**
 * Find by specific Event ID|HASH
 * @param id
 * @param callback
 */
module.exports = function (id, callback) {
  return this.get('/schedule/' + id, callback);
}
