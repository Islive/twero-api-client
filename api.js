(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals

    root.clubisliveApiClient = factory();
  }
}(this, function () {
  function Api(apiKey, options) {
    require('labels');

    // When this function is called without the new keyword, return a new copy of Api
    if (!(this instanceof Api)) {
      return new Api(apiKey, options);
    }

    // Options has to be an object
    if (!options) {
      options = {};
    }

    if (typeof options === 'string') {
      options = {
        url: options
      };
    }

    if (!options.url && !options.io) {
      options.url = 'https://api.twero.com';
    }

    // We remove trailing slash
    if (options.url.substr(-1) === '/') {
      options.url = options.url.slice(0, -1);
    }

    if (options.testMode) {
      this.testMode = true;
    }

    this.token      = options.token || null;
    this.io         = options.io;
    this.url        = options.url;
    this.apiKey     = apiKey;
    this.apiVersion = '2';
    this.language   = options.language || 'en';
    this.noQueue    = options.noQueue === true;

    this.logTime    = localStorage.getItem('api-log-times') || false;

    // If we're using sails.io, add something to add the event handlers
    if (this.io) {
      if (this.io.socket) {
        this.connected = true;
        this.io.socket.on('disconnect', function () {
          this.connected = false;
          this.handleSocketDisconnect();
        }.bind(this));
        this.io.socket.on('connected', function () {
          this.connected = true;
        }.bind(this));
        this.io.socket.on('reconnect', function () {
          this.connected = true;
        }.bind(this));
      }

      this.eventHandlers = {};
    }

    // We use a queue when noQueue is omitted from options
    if (!this.noQueue) {
      this.concurrentCalls = options.concurrentCalls || 1;
      this.initQueue();
    }

    // Get All available API methods
    const apiMethods = require('methods');

    // Parse API methods To bound function
    require('parse-api-methods');
  }

  Api.prototype = require('api-prototype');

  return Api;
}));
