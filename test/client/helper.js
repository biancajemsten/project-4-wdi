process.env.NODE_ENV = 'test';
require('babel-register')();

function nullFunc() {
  return null;
}

require.extensions['.css'] = nullFunc;
require.extensions['.scss'] = nullFunc;
require.extensions['.png'] = nullFunc;
require.extensions['.jpg'] = nullFunc;
require.extensions['.gif'] = nullFunc;

const { configure } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

configure({ adapter: new Adapter() });

const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

window.localStorage = (function(){
  var storage = {};

  return {
    getItem: function(key) {
      return storage[key];
    },
    removeItem: function(key) {
      delete storage[key];
    },
    setItem: function(key, item) {
      storage[key] = item;
    }
  };
})();

function Map() {
  this.getCenter = function() {};
}
function Marker() {
  this.setMap = function() {};
}
function Autocomplete() {}
global.google = {
  maps: {
    Map,
    Marker,
    places: {
      Autocomplete
    }
  }
};

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}
global.atob = require('atob');
global.window = window;
global.document = window.document;
global.navigator = { userAgent: 'node.js' };

copyProps(window, global);
