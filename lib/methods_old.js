module.exports = {
  user: {
    earnings: [GENERATE_GET, 'user/earnings'],
    trackthisToken: [GENERATE_GET, 'user/trackthis-token'],
    ignore: [GENERATE_GET_APPEND_PARAM1_TO_URL, '/user/match/ignore/'],
    login: function (role, username, password, callback) {
      // Role is optional, defaults to 'user'
      if (!callback) {
        callback = password;
        password = username;
        username = role;
        role     = undefined;
      }

      return this.post('user/login', { role: role, username: username, password: password }, callback);
    },
    loginByHash: function (hash, callback) {
      return this.post('user/login/' + hash, callback);
    },
    forgotPassword: function (username, email, callback) {
      // Role is optional, defaults to 'user'
      if (!callback) {
        callback = email;
        email    = username;
        username = null;
      }

      if (typeof username === 'string' && username.indexOf('@') > -1) {
        email    = username;
        username = null;
      }

      if (typeof email === 'string' && email.indexOf('@') === -1) {
        username = email;
        email    = null;
      }

      return this.post('user/forgot-password', { username: username, email: email }, callback);
    },
    verifyEmail: function (hash, callback) {
      return this.post('user/verify-email', { hash: hash }, callback);
    },
    resetPassword: function (hash, password, callback) {
      return this.post('user/reset-password', { hash: hash, password: password }, callback);
    },
    resendValidationMail: [GENERATE_GET, 'user/resend-validate-email'],
    online: GENERATE_GET,
    matches: GENERATE_GET,
    uploadSnapshot: function (snapshot, type, params, callback) {
      if (typeof type === 'function') {
        callback = type;
        params   = null;
        type     = null;
      } else if (typeof params === 'function') {
        callback = params;

        if (typeof type === 'string') {
          params = null
        } else {
          params = type;
          type   = null;
        }
      }

      params = params || {};

      params.snapshot = snapshot;

      if (type) {
        params.type = type;
      }

      return this.post('user/storage/snapshot', params, callback);
    },
    setProfileCover: function (attachment, callback) {
      return this.post('attachment/profile', { attachment: attachment }, callback);
    },
    removeProfileCover: function (callback) {
      return this.get('attachment/remove/profile', callback);
    },
    findByUsername: [GENERATE_GET_APPEND_PARAM1_TO_URL, 'user/find/'],
    find          : function (searchOptions, page, callback) {
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

      return this.get('user/find', searchOptions, callback);
    },
    suggestedFuddies : function (options, callback) {
      options = options || {};

      return this.get('user/suggested/fuddies', options, callback);
    },
    tip: function (userId, amount, options, callback) {
      var params = {
        amount: amount
      };

      if (!callback) {
        callback = options;
        options  = false;
      }

      if (options && options.type) {
        params.type = options.type || false;
      }

      if (options && options.name) {
        params.name = options.name || false;
      }

      return this.post('user/tip/' + userId, params, callback);
    },
    remove: function (callback) {
      return this.post('user/delete', callback);
    },
    autocomplete: function (query, callback) {
      return this.get('user/autocomplete', { q: query }, callback);
    },
    birthdays: function (options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options  = undefined;
      }
      return this.get('/user/birthdays', options, callback);
    }
  },
  agenda: {
    fetchSchedule: [GENERATE_GET_APPEND_PARAM1_TO_URL, 'schedule/']
  },
  news: {
    fetch: [GENERATE_GET, 'news']
  },
  message: {
    fetchByUsername: [GENERATE_GET_APPEND_PARAM1_TO_URL, 'message/fetch/'],
    inbox: function (page, callback) {
      if (!callback) {
        callback = page;
        page     = 1;
      }

      if (isNaN(page)) {
        page = 1;
      }

      return this.get('message/inbox', { page: page }, callback);
    },
    compose: function (to, title, content, callback) {
      return this.post('message', { to: to, message: { title: title, content: content } }, callback);
    },
    reply: function (to, hash, content, callback) {
      return this.post('message/' + hash, { to: to, message: { content: content } }, callback);
    },
    unread  : GENERATE_GET,
    markRead: function (hash, messageId, callback) {
      if (!callback) {
        callback  = messageId;
        messageId = undefined;
      }

      var url = 'message/read/' + hash;

      if (messageId) {
        url += '/' + messageId;
      }

      return this.get(url, callback);
    }
  },
  conversation: {
    archive     : [GENERATE_GET_APPEND_PARAM1_TO_URL, 'conversation/archive'],
    markAsRead  : [GENERATE_GET_APPEND_PARAM1_TO_URL, 'conversation/read'],

    fetchUnread : [GENERATE_GET, 'conversation/unread'],

    fetch : function (userId, page, params, callback) {
      if (typeof page === 'function') {
        callback = page;
        page     = undefined;
        params  = undefined;
      } else if (typeof params === 'function') {
        callback = params;
        if (typeof page === 'object') {
          params = page;
          page    = undefined;
        } else {
          params = undefined;
        }
      }

      page    = page || 1;
      params = params || {};

      params.page = page;

      return this.get('conversation/' + userId, params, callback);
    },

    fetchAll: function (params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params   = {};
      }

      return this.get('conversation/all', params, callback);
    },

    send  : function (userId, message, attachment, callback) {
      if (typeof attachment === 'function') {
        callback = attachment;
        attachment = null;
      }

      var data = { message: message };

      if (attachment) {
        data.attachment = attachment;
      }

      return this.post('conversation/' + userId, data, callback);
    }
  },
  follow: {
    isFollowing      : [GENERATE_GET_APPEND_PARAM1_TO_URL, 'follow/'],
    fetchAll         : [GENERATE_GET, 'follow/all'],
    fetchAllFollowers: function (userId, page, options, callback) {
      if (typeof userId === 'function') {
        callback = userId;
        userId   = null;
      } else if (typeof page === 'function') {
        callback = page;
        page     = undefined;
      } else if (typeof options === callback) {
        callback = options;
        options  = undefined;

        if (typeof page === 'object') {
          options = page;
          page    = undefined;
        }
      }

      options = options || {};

      if (page) {
        options.page = page;
      }

      if (!userId) {
        return this.get('followers', options, callback);
      }

      return this.get('followers/' + userId, options, callback);
    },
    fetchAllFollowed: function (userId, page, options, callback) {
      if (typeof userId === 'function') {
        callback = userId;
        userId   = null;
      } else if (typeof page === 'function') {
        callback = page;
        page     = undefined;
      } else if (typeof options === callback) {
        callback = options;
        options  = undefined;

        if (typeof page === 'object') {
          options = page;
          page    = undefined;
        }
      }

      options = options || {};

      if (page) {
        options.page = page;
      }

      if (!userId) {
        return this.get('follows', options, callback);
      }

      return this.get('follows/' + userId, options, callback);
    },
    follow           : function (userId, callback) {
      return this.post('follow', { userId: userId }, callback);
    },
    unfollow: [GENERATE_GET_APPEND_PARAM1_TO_URL, 'unfollow/']
  },
  payment: {
    getAssortiment: [GENERATE_GET_APPEND_PARAM1_TO_URL, 'payment/assortiment/'],
    createSession : function (bundleId, extraOptions, callback) {
      if (!callback) {
        callback     = extraOptions;
        extraOptions = undefined;
      }

      if (typeof extraOptions !== 'object') {
        extraOptions = {};
      }

      extraOptions.bundle = bundleId;

      return this.get('payment/start', extraOptions, callback);
    },
    getRedeemInfo: function (bundleId, callback) {
      return this.get('payment/redeem', { bundle: bundleId }, callback);
    },
    redeemCode: function (bundleId, code, options, callback) {
      if (!callback) {
        callback = options;
        options  = {};
      }

      options = options || {};

      options.bundle = bundleId;
      options.redeem = code;

      return this.post('payment/redeem', options, callback);
    }
  },
  media: {
    create          : [GENERATE_POST, 'media'],
    moderate        : GENERATE_GET,
    update          : [GENERATE_POST, 'media/update'],
    fetchOwn        : function (media, callback) {
      if (typeof media === 'function') {
        callback = media;
        media    = undefined;
      }

      // Legacy-support, media is the ID and not the object
      if (typeof media === 'number') {
        const container = media;
        media = {
          id : container,
        };
      }

      return this.get('media', media, callback);
    },
    fetchBought     : [GENERATE_GET, 'media/bought'],
    fetchByFollowers: function (userId, limit, callback) {
      if (!callback) {
        callback = limit;
        limit    = undefined;
      }

      var params = {};
      if (limit) {
        params.amount = limit;
      }

      return this.get('media/following/' + userId, params, callback);
    },
    fetchAll       : function (type, page, gender, callback) {
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
    },
    fetchByUsername: [GENERATE_GET_APPEND_PARAM1_TO_URL, 'media/'],
    pending        : GENERATE_GET,
    fetchAlbum     : function (username, albumId, callback) {
      return this.get('media/' + username + '/' + albumId, callback);
    },
    viewAlbum      : [GENERATE_GET_APPEND_PARAM1_TO_URL, 'media/view/'],
    checkAccess    : [GENERATE_GET_APPEND_PARAM1_TO_URL, 'media/access/'],
    remove         : [GENERATE_POST, 'media/remove'],
    search         : function (filters, callback) {
      if (!callback) {
        callback = filters;
        filters  = null;
      }

      return this.get('media/search', filters, callback);
    },
    buy: function (mediaId, callback) {
      return this.post('media/buy', { media: mediaId }, callback);
    },
    rate: function (mediaId, score, callback) {
      return this.post('media/rating/'+ mediaId, { score: score }, callback);
    },
    fetchOwnRating  : function (media, callback) {
      if (typeof media === 'function') {
        callback = media;
        media    = undefined;
      }

      // Legacy-support, media is the ID and not the object
      if (typeof media === 'number') {
        const container = media;
        media = {
          model : 'media',
          id    : container,
        };
      }

      return this.get('media/rating/', media, callback);
    },
    viewAttachment  : function (data, callback) {
      // Legacy-support, media is the ID and not the object
      if (typeof data === 'number') {
        const container = data;
        data = {
          postId : container,
        };
      }

      return this.get('media/attachment', data, callback);
    },
    viewAttachments : function (data, callback) {
      return this.get('media/attachments', data, callback);
    },
    viewSnapshot : [GENERATE_GET_APPEND_PARAM1_TO_URL, 'media/snapshot/'],
  },
  shop: {
    fetch: [GENERATE_GET_APPEND_PARAM1_TO_URL, 'shop'],
    buy: function (itemId, receiverId, message, callback) {
      if (typeof message === 'function') {
        callback = message;
        message   = null;
      }

      var data = {
        media   : itemId,
        receiver: receiverId,
        meta    : {
          message: message
        }
      };
      return this.post('media/buy', data, callback);
    }
  },
  activity: {
    news    : [GENERATE_GET, '/activities/news'],
    history : function (event, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options  = {};
      }

      options.event = event;

      return this.get('/activities/history', options, callback);
    },
    fetch   : [GENERATE_GET, 'activities'],
    fetchOne: [GENERATE_GET_APPEND_PARAM1_TO_URL, 'activities'],
    daily : function (options, callback) {
      options = options || {};

      return this.get('activity/daily', options, callback);
    }
  },
  chat: {
    setVIP: function (status, userId, callback) {
      return this.get('chat/vip/' + status + '/' + userId, callback);
    },
    setFreechat: function (status, callback) {
      return this.get('chat/freechat/' + status, callback);
    },
    setCyberToy: function (type, status, callback) {
      return this.get('chat/toy/'+ type +'/' + status, callback);
    },
    start: function (username, callback) {
      if (!callback) {
        callback = username;
        username = undefined;
      }

      if (username) {
        return this.get('chat/start/' + username, callback);
      }

      return this.get('chat/start', callback);
    },
    keepAlive: function (userId, callback) {
      if (!callback) {
        callback = userId;
        userId = undefined;
      }

      if (userId) {
        return this.get('chat/keepalive/' + userId, { skipQueue: true }, callback);
      }

      return this.get('chat/keepalive', callback);
    },
    kick: function (username, callback) {
      return this.get('chat/kick/' + username, callback);
    },
    end: function (username, callback) {
      if (!callback) {
        callback = username;
        username = undefined;
      }

      if (username) {
        return this.get('chat/end/' + username, callback);
      }

      return this.get('chat/end', callback);
    },
    startShow: function(requestObject, callback) {
      return this.post('chat/show/start', requestObject, callback);
    },
    endShow: function(mediaId, callback) {
      return this.post('chat/show/end', { mediaId: mediaId }, callback);
    },
    getShow: function(mediaId, callback) {
      return this.get('chat/show/get/' + mediaId, callback);
    },
    addUserToShow: function(requestObject, callback) {
      return this.post('chat/show/add', requestObject, callback);
    },
    latestEarnings:  [GENERATE_GET, 'chat/latest-earnings']
  },
  rules : {
    promotion: function (callback) {
      return this.get('rules/promotion', callback);
    }
  },
  post: {
    all: [GENERATE_GET, 'posts/all'],
    fetch: function (userId, options, callback) {
      if (typeof userId === 'function') {
        callback = userId;
        options  = undefined;
        userId   = undefined;
      } else if (typeof userId === 'object') {
        callback = options;
        options  = userId;
        userId   = undefined;
      }

      if (typeof options === 'function') {
        callback = options;
        options  = undefined;
      }

      options = options || {};

      if (!userId) {
        return this.get('posts', options, callback);
      }

      return this.get('posts/user/' + userId, options, callback);
    },
    fetchSelection: function (postIds, options, callback) {
      if (!callback) {
        callback = options;
        options  = undefined;
      }

      options = options || {};

      if (postIds instanceof Array) {
        options.postIds = postIds;

        return this.get('posts/selection', options, callback);
      }

      return this.get('post/' + postIds, options, callback);
    },
    fetchReplies: function (postId, lowerThanPostId, options, callback) {
      if (typeof lowerThanPostId === 'function') {
        callback        = lowerThanPostId;
        options         = undefined;
        lowerThanPostId = undefined;
      } else if (typeof lowerThanPostId === 'object') {
        callback        = options;
        options         = lowerThanPostId;
        lowerThanPostId = undefined;
      }

      options = options || {};

      if (lowerThanPostId) {
        options.lowestId = lowerThanPostId;
      }

      return this.get('posts/replies/' + postId, options, callback);
    },
    fetchSuggested: function (options, callback) {
      options = options || {};

      return this.get('post/suggested', options, callback);
    },
    compose: function (body, attachment, callback) {
      if (typeof attachment === 'function') {
        callback   = attachment;
        attachment = undefined;
      }

      var postData = { body: body };

      if (attachment) {
        postData.attachment = attachment;
      }

      return this.post('post', postData, callback);
    },
    reply: function (postId, body, attachment, callback) {
      if (typeof attachment === 'function') {
        callback   = attachment;
        attachment = undefined;
      }

      var postData = { body: body };

      if (attachment) {
        postData.attachment = attachment;
      }

      return this.post('post/reply/' + postId, postData, callback);
    },
    rate: function (postId, score, callback) {
      return this.post('/post/rating/'+ postId, { score: score }, callback);
    },
    fetchLikers: function (section, identifier, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = null;
      }

      return this.get('/rating/users/'+ section +'/' + identifier, options, callback);
    },
    delete: function (postId, callback) {
      return this.post('post/delete/' + postId, callback);
    },
    pin: function (postId, onNewsPage, callback) {
      var pinUrl = 'post/pin/';

      if (typeof onNewsPage === 'function') {
        callback   = onNewsPage;
        onNewsPage = undefined;
      }

      if (onNewsPage) {
        pinUrl += 'news/';
      }

      return this.get(pinUrl + postId, callback);
    },
    unpin: function (postId, onNewsPage, callback) {
      var unpinUrl = 'post/unpin/';

      if (typeof onNewsPage === 'function') {
        callback   = onNewsPage;
        onNewsPage = undefined;
      }

      if (onNewsPage) {
        unpinUrl += 'news/';
      }

      return this.get(unpinUrl + postId, callback);
    }
  },
  abuse: {
    report: function (suspectUserId, section, identifier, reason, callback) {
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
  },
  rating : {
    fetchSummary : function (model, foreignKey, callback) {
      return this.get('rating/' + model + '/' + foreignKey, callback);
    }
  },
  events: {
    create: function (data, callback) {
      return this.post('/schedule', data, callback);
    },
    find: function (options, callback) {
      return this.get('/schedule/', options, callback);
    },
    findOne: function (id, callback) {
      return this.get('/schedule/' + id, callback);
    },
    update: function (data, callback) {
      return this.put('/schedule/' + data.id, data, callback)
    },
    updateUserState: function (data, callback) {
      return this.put('/schedule/user/state', data, callback)
    },
    remove: function (id, callback) {
      return this.delete('/schedule/' + id, callback);
    }
  }
}