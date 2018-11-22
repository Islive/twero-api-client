module.exports = function (searchOptions, page, callback) {
  if (!callback) {
    callback = page;
    if (typeof searchOptions === 'object') {
      page = 1;
    } else {
      page          = searchOptions;
      searchOptions = {};
    }
  }

  if (typeof searchOptions !== 'object') {
    searchOptions = {};
  }

  if (isNaN(page)) {
    page = 1;
  }

  searchOptions.page = page;

  return this.get('performer/search', searchOptions, callback);
}