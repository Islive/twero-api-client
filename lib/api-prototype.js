module.exports = {

  /**
   *  HQ Events
   */

  Events: {
    CUSTOMER     : 'user',
    ACTIVITY     : 'activity',
    NEWS         : 'news'
  },

  EOnlineStatus: {
    OFFLINE   : 0,
    ONLINE    : 1
  },

  Activities: {
    OFFLINE         : 'offline',
    ONLINE          : 'online',
    BIRTHDAY        : 'birthday',
    FREECHAT        : 'freechat',
    ABUSE           : 'abuse',
    POST            : 'post',
    REPLY           : 'reply',
    MENTIONED       : 'mentioned',
    FOLLOW          : 'follow',
    MEDIA           : 'media',
    MEDIA_APPROVED  : 'media_approved',
    MESSAGE         : 'message',
    MESSAGE_REMINDER: 'message_reminder',
    RATING          : 'rating',
    PROFILE         : 'profile',
    PROFILE_COVER   : 'profile_cover',
    SNAPSHOT        : 'snapshot',
    PUBLIC          : 'public'
  },

  handleSocketDisconnect: function () {
    if (this.noQueue) {
      return;
    }

    // If we get here, remove all running and queued requests and call their callback with an error

    function failRequest (data) {
      if (!(data instanceof Array)) {
        return;
      }

      data[3] = data[3] || function () {};

      data[3]('socket disconnected', null);
    }

    // First all running requests
    while (this.requestsRunning.length > 0) {
      failRequest(this.requestsRunning.shift());
    }

    // Now all queued requests
    while (this.requestQueue.length > 0) {
      failRequest(this.requestQueue.shift());
    }
  },

  on: function (eventName, func) {
    if (!this.eventHandlers) {
      // events not initialized, just return
      return;
    }

    if (eventName instanceof Array) {
      eventName.map(function (singleEventName) {
        this.on(singleEventName, func);
      });

      return;
    }

    if (typeof func !== 'function') {
      throw 'Not a valid function';
    }

    // If the event is not yet subscribed to, add it, and listen for it
    if (!this.eventHandlers[eventName]) {
      this.io.socket.on(eventName, this.trigger.bind(this, eventName));

      this.eventHandlers[eventName] = [func];
      return;
    }

    // First check if it exists
    for (var i = 0; i < this.eventHandlers[eventName].length; i++) {
      if (this.eventHandlers[eventName][i] === func) {
        return;
      }
    }

    // Add it
    this.eventHandlers[eventName].push(func);
  },

  off: function (eventName, func) {
    if (!this.eventHandlers) {
      // events not initialized, just return
      return;
    }

    if (eventName instanceof Array) {
      eventName.map(function (singleEventName) {
        this.off(singleEventName, func);
      });

      return;
    }

    if (typeof func !== 'function') {
      throw 'Not a valid function';
    }

    // event is not subscribed to
    if (!this.eventHandlers[eventName]) {
      return;
    }

    // Check if it exists
    for (var i = 0; i < this.eventHandlers[eventName].length; i++) {
      if (this.eventHandlers[eventName][i] === func) {
        this.eventHandlers.splice(i, 1);
        break;
      }
    }

    // If there are no more listeners, unsubscribe
    if (this.eventHandlers[eventName].length === 0) {
      this.socket.off(eventName);
      delete this.eventHandlers[eventName];
    }
  },

  trigger: function (eventName, data) {
    if (!this.eventHandlers) {
      // events not initialized, just return
      return;
    }

    if (eventName instanceof Array) {
      eventName.map(function (singleEventName) {
        this.trigger(singleEventName, data);
      });

      return;
    }

    // event is not subscribed to
    if (!this.eventHandlers[eventName]) {
      return;
    }

    for (var i = 0; i < this.eventHandlers[eventName].length; i++) {
      setTimeout(this.eventHandlers[eventName][i].bind(this, data), 0);
    }
  },

  /**
   *  Queue stuff
   */

  // Init the queue, overrides some functions so everything must pass through the queue
  initQueue: function () {
    this.doRequest       = this.request;
    this.request         = this.addToQueue;
    this.requestQueue    = [];
    this.requestsRunning = [];
  },

  addToQueue: function (method, url, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params   = {};
    }

    params = params || {};

    // If the socket is disconnected, just call the callback with an error since it will never happen
    if (this.io && this.io.socket && !this.connected) {
      return callback('socket disconnected', null);
    }

    var requestArray = [method, url, params, callback];

    if (params.skipQueue) {
      delete params.skipQueue;
      this.requestsRunning.push(requestArray);
      return this.doRequest(method, url, params, function (error, result) {
        this.removeFromRunningRequests(requestArray);
        setTimeout(function () {
          callback(error, result);
        }, 0);
        this.startQueue();
      }.bind(this));
    }

    for (var i=0; i < this.requestQueue.length; i++) {
      var qitem = this.requestQueue[i];

      if (
        requestArray[0] == qitem[0] &&
        requestArray[1] == qitem[1] &&
        JSON.stringify(requestArray[2]) == JSON.stringify(qitem[2])
      ) {
        if (this.logTime) {
          console.warn(name, 'Duplicated queue item', requestArray[0], requestArray[1], JSON.stringify(requestArray[2]));
        }
        // Callback juggling
        if (!(this.requestQueue[i][3] instanceof Array)) {
          this.requestQueue[i][3] = [this.requestQueue[i][3]];
        }

        this.requestQueue[i][3].push(requestArray[3]);

        return;
      }
    }

    this.requestQueue.push(requestArray);

    this.startQueue();
  },

  removeFromRunningRequests: function (obj) {
    for (var i = 0; i < this.requestsRunning.length; i++) {
      if (this.requestsRunning[i] == obj) {
        this.requestsRunning.splice(i,1);
        return;
      }
    }
  },

  // Start the queue async
  startQueue: function () {
    if (this.requestsRunning.length >= this.concurrentCalls || this.requestQueue.length === 0) {
      return;
    }

    setTimeout(this.processQueue.bind(this), 0);
  },

  // Process a queue item and advance to the next
  processQueue: function () {
    if (this.requestQueue.length === 0 || this.requestsRunning.length >= this.concurrentCalls) {
      return;
    }

    var currentRequest = this.requestQueue.shift(),
        self           = this;

    this.requestsRunning.push(currentRequest);

    currentRequest[3] = currentRequest[3] || function () {};

    if (currentRequest[3] instanceof Array) {
      var callbacks = currentRequest[3];

      currentRequest[3] = function(error, result) {
        if (self.logTime) {
          console.info('Multiple processes wants their call back.', callbacks.length);
        }
        callbacks.forEach(function(cb) {
          cb(error, result)
        });
      };
    }

    this.doRequest.call(this, currentRequest[0], currentRequest[1], currentRequest[2], function (error, result) {
      this.removeFromRunningRequests(currentRequest);
      currentRequest[3](error, result);
      this.startQueue();
    }.bind(this));
  },

  client: function() {
    var xhr = new XMLHttpRequest();

    return xhr;
  },

  /**
   * Serialize the given object to an query string.
   *
   * @param   {{}} obj
   * @returns {string}
   */
  serialize: function(obj, prefix) {
    var str = [];
    for(var p in obj) {
      if (!obj.hasOwnProperty(p)) {
        continue;
      }
      var k = prefix ? prefix + '[' + p + ']' : p,
          v = obj[p];

      if (typeof v === 'object') {
        if (v === null) {
          // null values have to be kept intact
          str.push(encodeURIComponent(k) + '=null');
        } else {
          str.push(this.serialize(v, k));
        }
        continue;
      }

      if (typeof v === 'boolean') {
        // boolean's also can't be cast to a string
        str.push(encodeURIComponent(k) + '=' + v);
        continue;
      }

      str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
    return str.join('&');
  },

  ioCallback: function (response, JWR, callback, url, startDate) {
    if (this.logTime) {
      console.info('('+ url +') Response Time:' + (new Date().getTime() - startDate.getTime()) + ' MS');
    }

    if (JWR.statusCode !== 200) {
      return callback(JWR.statusCode, response);
    }
    if (!response) {
      return callback('no_response', response);
    }
    if (response.Errors) {
      return callback(response.Errors, response);
    }
    if (response.status && response.status != 200 && response.status != 'ok') {
      return callback(response.status, response);
    }

    callback(null, response);
  },

  request: function(method, url, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params   = {};
    }

    if(['GET', 'POST', 'PUT', 'DELETE'].indexOf(method) === -1) {
      throw new Error('Invalid method ' + method);
    }

    if (typeof params !== 'object') {
      throw new Error('Params is not an object');
    }

    if (typeof callback !== 'function') {
      throw new Error('Callback is not an function');
    }

    params = params || {};

    if (!params.lang) {
      params.lang = this.language;
    }

    if (this.testMode && !params.testmode) {
      params.testmode = 1;
    }

    if (!params.token && this.token) {
      params.token = this.token;
    }

    // Remove skipQueue if present, because the queue is not enabled if it's still here
    if (params.skipQueue) {
      delete params.skipQueue;
    }

    // Urls have to start with a slash
    if (url.substr(0,1) !== '/') {
      url = '/' + url;
    }

    // Do we have a sails.io instance? if we do, let it handle the request and bail out;
    if (this.io && this.io.socket) {
      // If the socket is disconnected, just call the callback with an error since it will never get into the callback
      if (!this.connected) {
        return callback('scoket disconnected', null);
      }

      if (!params['x-apikey']) {
        params['x-apikey'] = this.apiKey;
      }

      var now = new Date();

      if (method === 'GET') {
        this.io.socket.get(url, params, function (response, JWR) {
          return this.ioCallback(response, JWR, callback, url, now);
        }.bind(this));

      } else if (method === 'POST') {
        this.io.socket.post(url, params, function (response, JWR) {
          return this.ioCallback(response, JWR, callback, url, now);
        }.bind(this));

      } else if (method === 'PUT') {
        this.io.socket.put(url, params, function (response, JWR) {
          return this.ioCallback(response, JWR, callback, url, now);
        }.bind(this));

      } else if (method === 'DELETE') {
        this.io.socket.delete(url, params, function (response, JWR) {
          return this.ioCallback(response, JWR, callback, url, now);
        }.bind(this));
      } else {
        throw 'method ' + method + ' not supported';
      }
      return;
    }

    var c        = this.client(),
        paramStr = this.serialize(params);

    c.open(method, this.url + url + (method === 'GET' && paramStr.length > 0 ? '?' + paramStr : ''), true);

    c.setRequestHeader('x-apikey',  this.apiKey);
    c.setRequestHeader('x-version', this.apiVersion);
    c.setRequestHeader('Content-type', 'application/json');

    c.onreadystatechange = function() {
      var response = null,
          error    = null;

      if (c.readyState !== 4) return;

      try {
        response = JSON.parse(c.responseText);
      } catch (exception) {
        response = null;
        error    = {
          error    : exception
        };
      }

      if (error != null) {
        error.status     = c.status;
        error.readyState = c.readyState;
      }

      if (error == null && c.status != 200) {
        error = c.status;
        response = response || {
          status      : c.status,
          responseText: c.responseText
        };
      }

      callback(error, response);
    };

    c.send(method !== 'GET' ? JSON.stringify(params) : null);
  },

  /**
   * Convert a Form object to an nested object
   * @param {HtmlElement} formElement
   * @returns {{}}
   */
  formValues: function(formElement) {
    var fieldsets = formElement.childNodes,
        vars      = {};

    for (var i in fieldsets) {
      var fieldset   = fieldsets[i],
          fieldsetVars = {},
          inputs     = fieldset.childNodes;

      if (fieldset.tagName !== 'FIELDSET') {
        continue;
      }

      for (var i in inputs) {
        var input = inputs[i];

        if (input.tagName !== 'INPUT') {
          continue;
        }

        fieldsetVars[input.name] = input.value;
      }

      vars[fieldset.name] = fieldsetVars;
    }

    return vars;
  },

  /**
   * Do a put call
   *
   * @param {string} url
   * @param {{}}     parameters
   * @param {Function(error, result)} callback
   *
   * @returns Api
   */
  put: function(url, params, callback) {
    this.request('PUT', url, params, callback);

    return this;
  },

  /**
   * Do a post call
   *
   * @param {string} url
   * @param {{}}     parameters
   * @param {Function(error, result)} callback
   *
   * @returns Api
   */
  post: function(url, params, callback) {
    this.request('POST', url, params, callback);

    return this;
  },

  /**
   * Do a get call
   *
   * @param {string} url
   * @param {{}}     parameters
   * @param {Function(error, result)} callback
   *
   * @returns Api
   */
  get: function(url, params, callback) {
    this.request('GET', url, params, callback);

    return this;
  },

  /**
   * Do a delete call
   *
   * @param {string} url
   * @param {{}}     parameters
   * @param {Function(error, result)} callback
   *
   * @returns Api
   */
  delete: function(url, params, callback) {
    this.request('DELETE', url, params, callback);

    return this;
  },

  /**
   * @param {HtmlElement} formElement
   * @param {{}}      object Nested object with { fieldsetName: { inputName: { placeholder: '', value: '', type: 'text' } }  }
   */
  convertObjectToForm: function(formElement, object) {
    for (var fieldsetName in object) {
      var fieldset      = object[fieldsetName],
          fieldsetElement = document.createElement('fieldset');

      fieldsetElement.name = fieldsetName;

      for (var inputName in fieldset) {
        var input = typeof fieldset[inputName] === 'object' ? fieldset[inputName] : { name : inputName, placeholder: fieldset[inputName] },
            id    = fieldsetName + '_' + inputName;

        var labelElement = document.createElement('label'),
            inputElement = document.createElement('input');

        labelElement.setAttribute('for', id);
        labelElement.textContent = input.label || input.name;

        inputElement.id          = id;
        inputElement.name        = input.name;
        inputElement.placeholder = input.placeholder || input.name;
        inputElement.type        = input.type || 'text';
        inputElement.value       = input.value || 'wawah';
        inputElement.setAttribute('required', input.required || 0);

        fieldsetElement.appendChild(labelElement);
        fieldsetElement.appendChild(inputElement);
      }

      formElement.appendChild(fieldsetElement);
    }
  }
}
