module.exports = function (model, foreignKey, callback) {
  return this.get('rating/' + model + '/' + foreignKey, callback);
}
