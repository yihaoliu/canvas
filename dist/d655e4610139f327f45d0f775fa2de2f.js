// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
//动画兼容


//旋转角度函数 mx = mouse.x | my = mouse.y | ox = object.x | oy = object.y
function RotationToMouse(mx, my, ox, oy) {
  var dx = mx - ox;
  var dy = my - oy;
  var angle = Math.atan2(dy, dx);
  return angle;
}

window.utils = {};
//捕获坐标
window.utils.captureMouse = function (element) {
  var mouse = { x: 0, y: 0 };

  element.addEventListener('mousemove', function (event) {
    var x, y;
    if (event.pageX || event.pageY) {
      x = event.pageX;
      y = event.pageY;
    } else {
      x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    x -= element.offsetLeft;
    y -= element.offsetTop;

    mouse.x = x;
    mouse.y = y;
  }, false);

  return mouse;
};

//获取触摸事件坐标
function captureTouch(element) {
  var touch = { x: null, y: null, isPressed: false, event: null },
      body_scrollLeft = document.body.scrollLeft,
      element_scrollLeft = document.documentElement.scrollLeft,
      body_scrollTop = document.body.scrollTop,
      element_scrollTop = document.documentElement.scrollTop,
      offsetLeft = element.offsetLeft,
      offsetTop = element.offsetTop,
      phone = ["ios", "android", "windowsPhone"];
  var os = getOS();
  var operation = {
    start: 'touchstart',
    end: 'touchend',
    move: 'touchmove'
  };
  if (phone.indexOf(os) == -1) {
    operation = {
      start: 'mousedown',
      end: 'mouseup',
      move: 'mousemove'
    };
  }

  element.addEventListener(operation.start, function (event) {
    touch.isPressed = true;
    touch.event = event;
    console.log("9999", event);
  }, false);

  element.addEventListener(operation.end, function (event) {
    touch.isPressed = false;
    touch.x = null;
    touch.y = null;
    touch.event = event;
  }, false);

  element.addEventListener(operation.move, function (event) {
    // var x, y,
    //     touch_event = event.touches[0]; //first touch

    // if (touch_event.pageX || touch_event.pageY) {
    // x = touch_event.pageX;
    // y = touch_event.pageY;
    // } else {
    // x = touch_event.clientX + body_scrollLeft + element_scrollLeft;
    // y = touch_event.clientY + body_scrollTop + element_scrollTop;
    // }
    // x -= offsetLeft;
    // y -= offsetTop;

    // touch.x = x;
    // touch.y = y;
    // touch.event = event;
  }, false);

  return touch;
};

window.utils.parseColor = function (color, toNumber) {
  if (toNumber === true) {
    if (typeof color === 'number') {
      return color | 0; //chop off decimal
    }
    if (typeof color === 'string' && color[0] === '#') {
      color = color.slice(1);
    }
    return window.parseInt(color, 16);
  } else {
    if (typeof color === 'number') {
      color = '#' + ('00000' + (color | 0).toString(16)).substr(-6); //pad
    }
    return color;
  }
};

//将16进制颜色转换成rgb
window.utils.colorToRGB = function (color, alpha) {
  //如果是字符串格式，转换为数字
  if (typeof color === "string" && color[0] === "#") {

    //parseInt(('#ffffff').slice(1),16) 为 16777215
    color = window.parseInt(color.slice(1), 16);
  }
  alpha = alpha === undefined ? 1 : alpha;

  //将color转换成r,g,b值，>>右移  <<左移
  var r = color >> 16 & 0xff; //例如：16777215 >> 16 变成 255， 255 & 0xff为255
  var g = color >> 8 & 0xff;
  var b = color & 0xff;
  a = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha;

  if (a === 1) {
    return "rgb(" + r + "," + g + "," + b + ")";
  } else {
    return "rgb(" + r + "," + g + "," + b + "," + a + ")";
  }
};

window.utils.containsPoint = function (rect, x, y) {
  return !(x < rect.x || x > rect.x + rect.width || y < rect.y || y > rect.y + rect.height);
};

window.utils.intersects = function (rectA, rectB) {
  return !(rectA.x + rectA.width < rectB.x || rectB.x + rectB.width < rectA.x || rectA.y + rectA.height < rectB.y || rectB.y + rectB.height < rectA.y);
};

function startLoop(callback) {
  // console.log(window,"ppp")
  // return;
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  }
  return window.requestAnimationFrame(callback);
}
function endLoop(callback) {
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = window.cancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame || window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame || window.clearTimeout;
  }

  return window.cancelAnimationFrame(callback);
}
function getWindowDetil() {
  var winHeight = 0;
  var winWidth = 0;
  if (window.innerWidth) winWidth = window.innerWidth;else if (document.body && document.body.clientWidth) winWidth = document.body.clientWidth; //获取窗口高度
  if (window.innerHeight) winHeight = window.innerHeight;else if (document.body && document.body.clientHeight) winHeight = document.body.clientHeight; //通过深入Document内部对body进行检测，获取窗口大小
  if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
    winHeight = document.documentElement.clientHeight;
    winWidth = document.documentElement.clientWidth;
  }
  console.log(winHeight);
  return {
    width: winWidth,
    height: winHeight
  };
}
function getOS() {
  var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
  var vendor = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '';
  var appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';

  if (/mac/i.test(appVersion)) return 'MacOSX';
  if (/win/i.test(appVersion)) return 'windows';
  if (/linux/i.test(appVersion)) return 'linux';
  if (/iphone/i.test(userAgent) || /ipad/i.test(userAgent) || /ipod/i.test(userAgent)) 'ios';
  if (/android/i.test(userAgent)) return 'android';
  if (/win/i.test(appVersion) && /phone/i.test(userAgent)) return 'windowsPhone';
}
exports.default = {
  startLoop: startLoop,
  endLoop: endLoop,
  getWindowDetil: getWindowDetil,
  captureTouch: captureTouch,
  getOS: getOS
};
},{}],4:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var rect = function rect() {
  this.isclick = false;
};
rect.prototype.draw = function (cxt, data) {
  console.log(this.click);
  cxt.fillStyle = this.isclick ? "#FF0000" : "#000000";
  cxt.fillRect(data.x, data.y, data.width, data.height);
};

exports.default = rect;
},{}],5:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var data = [{ x: 50, y: 50, width: 50, height: 30 }, { x: 150, y: 50, width: 50, height: 30 }, { x: 50, y: 150, width: 50, height: 30 }, { x: 250, y: 50, width: 50, height: 30 }, { x: 50, y: 250, width: 50, height: 30 }, { x: 50, y: 350, width: 50, height: 30 }];

exports.default = data;
},{}],2:[function(require,module,exports) {
"use strict";

var _utils = require("./utils");

var _utils2 = _interopRequireDefault(_utils);

var _rect = require("./rect");

var _rect2 = _interopRequireDefault(_rect);

var _data = require("./data");

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (glbal) {

  // function draw(){
  //     // console.log("draw",i++);
  //     // utils.loop(draw)
  // }


  var myCan = function myCan() {
    var win = _utils2.default.getWindowDetil();
    this.width = win.width;
    this.height = win.height;
    this.elem = null;
    this.ctx = null;
  };
  myCan.prototype.render = function (elem, canDetail, callback) {
    var node = document.createElement("canvas");
    if (canDetail) {
      for (var key in canDetail) {
        node[key] = canDetail[key];
      }
    }
    if (!canDetail || !canDetail.width) {
      node.width = this.width;
    }
    if (!canDetail || !canDetail.height) {
      node.height = this.height;
    }
    elem.appendChild(node);
    var mouse = _utils2.default.captureTouch(node);
    this.elem = node;
    this.ctx = node.getContext('2d');

    callback && callback();

    // var newRect= new rect();
    // newRect.draw(this.ctx)
    return node;
  };
  myCan.prototype.draw = function (detail) {
    var _this = this;

    var rectArr = [];

    detail.map(function (item, index) {
      var newRect = new _rect2.default();
      newRect.draw(_this.ctx, detail[index]);
      rectArr.push(new _rect2.default());
    });

    // rectArr.map((item,index)=>{
    //    console.log(detail[index])
    //     item.draw(this.ctx,detail[index]);
    // })
  };
  var newCan = new myCan();
  var app = document.getElementById("app");
  newCan.render(app);
  // newCan.draw()
  newCan.draw(_data2.default);

  // global.canvas = newCan;

})(undefined);
},{"./utils":3,"./rect":4,"./data":5}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var ws = new WebSocket('ws://localhost:64476/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,2])