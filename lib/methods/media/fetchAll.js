module.exports = function (type, page, gender, callback) {
  if (typeof page === 'function') {
    callback = page;
    gender   = null;
    page     = 1;
  }

  if (typeof gender === 'function') {
    callback = gender;
    gender   = null;
  }

  if (isNaN(page)) {
    gender = page;
    page   = 1;
  }

  var searchOptions = { page: page };

  if (gender) {
    searchOptions.gender = gender;
  }

  return this.get('media/all/' + type, searchOptions, callback);
}