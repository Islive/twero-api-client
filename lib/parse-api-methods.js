// Loop through all api methods
for (var objectName in apiMethods) {
  if (typeof this[objectName] === 'undefined') {
    this[objectName] = {};
  }

  // Loop through all functions inside this api method group
  for (var methodName in apiMethods[objectName]) {
    if (typeof apiMethods[objectName][methodName] === 'string' || (typeof apiMethods[objectName][methodName] === 'object' && apiMethods[objectName][methodName] instanceof Array)) {
      // We are gonna generate a function
      this[objectName][methodName] = function(objectName, methodName) {
        var params       = Array.prototype.slice.call(arguments, 2),
            routeDetails = [];

        if (typeof apiMethods[objectName][methodName] === 'string') {
          // We need to generate the route from the objectname + methodname
          routeDetails = [apiMethods[objectName][methodName], [objectName, methodName].join('/')];
        } else if (typeof apiMethods[objectName][methodName] === 'object' && apiMethods[objectName][methodName] instanceof Array) {
          // We got supplied a route
          routeDetails = apiMethods[objectName][methodName];
        } else {
          // Not a string and not an array, so we fail
          throw new Error('Invalid route');
        }

        params.unshift(routeDetails[1]);

        if (routeDetails[0] === GENERATE_GET) {
          return Api.prototype.get.apply(this, params);
        }

        if (routeDetails[0] === GENERATE_GET_APPEND_PARAM1_TO_URL) {
          if (params[0].substr(-1) !== '/') {
            params[0] += '/';
          }
          params[0] += params[1];
          params.splice(1,1);
          return Api.prototype.get.apply(this, params);
        }

        if (routeDetails[0] === GENERATE_POST) {
          return Api.prototype.post.apply(this, params);
        }

        // No valid generate method selected
        throw new Error('No valid generate method');
      }.bind(this, objectName, methodName);
    } else {
      // It is a function, so add it
      this[objectName][methodName] = apiMethods[objectName][methodName].bind(this);
    }
  }
}