
import utils from './utils';
import rect from "./rect";
import data from "./data";
import addEvent from "./utils/addEvent"
import imgurl from '../images/bg.png'
(function(glbal){
    
    var img = new Image();
        img.src = imgurl;

    var myCan = function(){
        var win = utils.getWindowDetil()
        this.width = win.width;
        this.height = win.height;
        this.elem = null;
        this.ctx = null;
        this.img = null;
        this.data = [].concat(data);
        this.imgOrigin = {
            x:0,
            y:0
        }
        //鼠标坐标其实是坐标原点的位置
        this.mouse = {
            x:null,
            y:null
        };
        this.mobile = {
            x:0,
            y:0
        }

        this.zoom = 1;
    }
    myCan.prototype.render = function(elem,canDetail,callback){
        var that = this;
        var node = document.createElement("canvas");
        node.style.margin =0;
        node.style.padding = 0;
        if(canDetail){
            for(var key in canDetail){
                node[key] = canDetail[key];
            }
        }
        if(!canDetail||!canDetail.width){
            node.width = this.width;
        }
        if(!canDetail||!canDetail.height){
            node.height = this.height;
        }
        elem.appendChild(node);
        //鼠标监听
        listener(node,'mousedown',function(detail){
            that.mouse = Object.assign(that.mouse,detail)
            var zoom = that.zoom;
            for(var i=0;i<that.data.length;i++){
                var item = that.data[i];
                var max = {
                    x:(item.x+item.width)*zoom,
                    y:(item.y+item.height)*zoom
                }
                var min = {
                    x:item.x*zoom,
                    y:item.y*zoom,
                }
                var mousToRect = false;
                var haveMous = that.mouse.x && that.mouse.y
                if(haveMous && (that.mouse.x > min.x && that.mouse.x < max.x) && (that.mouse.y > min.y && that.mouse.y < max.y)){
                    item.mousToRect = !item.mousToRect;
                    that.data[i] = item;
                    break;
                }
            }
            that.draw();
        })
        //滚轮监听
        listener(node, "mousewheel", function (detail) {
            if (event.delta < 0) { 
                that.zoom-=0.02
            }else{
                that.zoom+=0.02
            }
            that.mouse = Object.assign(that.mouse, detail)
            that.mobile.x = (1 - that.zoom) * (that.mouse.x - that.imgOrigin.x);
            that.mobile.y = (1 - that.zoom) * (that.mouse.y - that.imgOrigin.y);
            that.imgOrigin.x = that.imgOrigin.x + that.mobile.x;
            that.imgOrigin.y = that.imgOrigin.y + that.mobile.y;
            that.draw()
        });
        
        this.elem = node;
        this.ctx = node.getContext('2d');
        img.onload = function () {
            that.draw()
        }
        callback && callback();
        return node;
    }
    myCan.prototype.draw =function(detail){
        this.ctx.clearRect(0,0,this.width,this.height);
        var rectArr = [];
        this.img = img;
        this.ctx.drawImage(this.img, this.imgOrigin.x, this.imgOrigin.y,img.width*this.zoom,img.height*this.zoom)
        this.data.map((item,index)=>{

            var newRect = new rect();
            var everyOrigin = item;
            everyOrigin.x = everyOrigin.x + this.mobile.x;
            everyOrigin.y = everyOrigin.y + this.mobile.y;
            this.data[index] = everyOrigin;
            
            newRect.draw(this.ctx,everyOrigin,this.zoom);
        })
    }
    var newCan = new myCan();
    var app = document.getElementById("app")
    newCan.render(app);
    function dataFilter(){

    }
    function listener(elem,type,callback){
        addEvent(elem, type, function (event) {
            var e = event || window.event;
            var mouse = {
                x:e.clientX,
                y:e.clientY
            }
            var elemDetail = elem.getBoundingClientRect();
            var mouseToCan = { x: mouse.x - elemDetail.x, y: mouse.y - elemDetail.y };
            var thatEvent = Object.assign({},e);
            
            callback && callback(Object.assign(thatEvent,mouseToCan))
        }, false);
    }

})(this)