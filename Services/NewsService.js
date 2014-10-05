'use strict';

var Promise = require('Promise');
var request = require('superagent');


var newItemsUrl = 'http://pipes.yahoo.com/pipes/pipe.run?_id=DqsF_ZG72xGLbes9l7okhQ&_render=json';
var NewsService = {

  getLatestNewsItems() {

    // Usage of Promises would require a polyfill for older browsers
    return new Promise((resolve, reject) => {

      // We can directly call Yahoo pipes with help of CORS. For IE8 support we
      // would still need to use JSONP and older IE versions require some patch
      // work (XDomainRequest).
      request
        .get(newItemsUrl)
        .end((res) => {
          if (res.ok) {
            resolve(res.body);
          }
          else {
            reject(res.text);
          }
        })
    });
  }

};

module.exports = NewsService;
