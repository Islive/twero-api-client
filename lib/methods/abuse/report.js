module.exports = function (suspectUserId, section, identifier, reason, callback) {
  if (typeof identifier === 'function') {
    callback   = identifier;
    reason     = section;
    identifier = undefined;
    section    = undefined;
  }

  var reportData = {
    suspect: suspectUserId,
    reason : reason
  };

  if (section) {
    reportData.foreignKey = identifier;
    return this.post('abuse/report/' + section, reportData, callback);
  }

  return this.post('abuse/report', reportData, callback);
}
