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
  }
}
