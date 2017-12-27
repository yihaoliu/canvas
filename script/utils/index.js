//动画兼容





//旋转角度函数 mx = mouse.x | my = mouse.y | ox = object.x | oy = object.y
function RotationToMouse(mx,my,ox,oy){
    var dx = mx - ox;
    var dy = my - oy;
    var angle = Math.atan2(dy,dx);
    return angle;
}

window.utils = {};
//捕获坐标
window.utils.captureMouse = function(element){
        var mouse = {x:0,y:0};
        
        element.addEventListener('mousemove',function(event){
            var x,y;
            if(event.pageX||event.pageY){
                x = event.pageX;
                y = event.pageY;
            }else{
                x = event.clientX + document.body.scrollLeft +document.documentElement.scrollLeft;
                y = event.clientY + document.body.scrollTop +document.documentElement.scrollTop;
            }
            
            x -= element.offsetLeft;
            y -= element.offsetTop;
            
            mouse.x = x;
            mouse.y = y;          
        },false);
        
         return mouse;  
    }
    
    //获取触摸事件坐标
function captureTouch (element) {
  var touch = {x: null, y: null, isPressed: false, event: null},
      body_scrollLeft = document.body.scrollLeft,
      element_scrollLeft = document.documentElement.scrollLeft,
      body_scrollTop = document.body.scrollTop,
      element_scrollTop = document.documentElement.scrollTop,
      offsetLeft = element.offsetLeft,
      offsetTop = element.offsetTop,
      phone=["ios","android","windowsPhone"];
      var os = getOS();
      var operation ={
          start:'touchstart',
          end:'touchend',
          move:'touchmove'
      }
      if(phone.indexOf(os) ==-1){
        operation ={
            start:'mousedown',
            end:'mouseup',
            move:'mousemove'
        }
      }
      
    element.addEventListener(operation.start, function (event) {
        touch.isPressed = true;
        touch.event = event;
        console.log("9999",event)
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
      return (color | 0); //chop off decimal
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
window.utils.colorToRGB = function(color,alpha){
    //如果是字符串格式，转换为数字
    if(typeof color === "string" && color[0] === "#"){
        
        //parseInt(('#ffffff').slice(1),16) 为 16777215
        color = window.parseInt(color.slice(1), 16);

    }
    alpha = (alpha === undefined)? 1 : alpha;
    
    //将color转换成r,g,b值，>>右移  <<左移
    var r = color >> 16 & 0xff; //例如：16777215 >> 16 变成 255， 255 & 0xff为255
    var g = color >>8 & 0xff;
    var b = color & 0xff;
    a = (alpha<0)? 0 : ((alpha>1)? 1 : alpha);
    
    if(a===1){
        return "rgb("+r+","+g+","+b+")";
    }else{
        return "rgb("+r+","+g+","+b+","+a+")";
    }
};

window.utils.containsPoint = function(rect, x, y){
    return !(x<rect.x || x>rect.x + rect.width ||
             y<rect.y || y>rect.y + rect.height);
}

window.utils.intersects = function(rectA, rectB){
    return !(rectA.x + rectA.width < rectB.x ||
             rectB.x + rectB.width < rectA.x ||
             rectA.y + rectA.height < rectB.y ||
             rectB.y + rectB.height < rectA.y);
}
    
    
     
function startLoop(callback){
    // console.log(window,"ppp")
    // return;
    if(!window.requestAnimationFrame){
        window.requestAnimationFrame =(window.webkitRequestAnimationFrame||
                                       window.mozRequestAnimationFrame||
                                       window.oRequestAnimationFrame||
                                       window.msRequestAnimationFrame||
                                      function(callback){
                                           return window.setTimeout(callback,1000/60); 
                                     });
        
    }
    return window.requestAnimationFrame(callback);
    
}
function endLoop(callback){
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||
                                       window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
                                       window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
                                       window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
                                       window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
                                       window.clearTimeout);
      }
      
      
    return  window.cancelAnimationFrame(callback)
}
function getWindowDetil (){
    var winHeight = 0;
    var winWidth = 0;
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;//获取窗口高度
    if (window.innerHeight)
            winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;//通过深入Document内部对body进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth){
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
    console.log(winHeight)
    return {
        width:winWidth,
        height:winHeight
    }
}
function getOS() {
    var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
    var vendor = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '';
    var appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';

    if (/mac/i.test(appVersion)) return 'MacOSX'
    if (/win/i.test(appVersion)) return 'windows'
    if (/linux/i.test(appVersion)) return 'linux'
    if (/iphone/i.test(userAgent) || /ipad/i.test(userAgent) || /ipod/i.test(userAgent)) 'ios'
    if (/android/i.test(userAgent)) return 'android'
    if (/win/i.test(appVersion) && /phone/i.test(userAgent)) return 'windowsPhone'
}
export default {
    startLoop:startLoop,
    endLoop:endLoop,
    getWindowDetil:getWindowDetil,
    captureTouch:captureTouch,
    getOS:getOS
}