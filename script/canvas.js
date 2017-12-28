
import utils from './utils';
import rect from "./rect";
import data from "./data";
import addEvent from "./utils/addEvent"
import imgurl from '../images/bg.png'
(function(glbal){
    
    // function draw(){
    //     // console.log("draw",i++);
    //     // utils.loop(draw)
    // }
    var img = new Image();
        img.src = imgurl;

    var myCan = function(){
        var win = utils.getWindowDetil()
        this.width = win.width;
        this.height = win.height;
        this.elem = null;
        this.ctx = null;
        this.img = null;
        this.mouse = {
            x:null,
            y:null
        };
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
        listener(node,function(detail){
            
            that.mouse = Object.assign(that.mouse,detail)
            var zoom = that.zoom;
            for(var i=0;i<data.length;i++){
                var item = data[i];
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
                if(haveMous){
                    that.mouse.x = that.mouse.x*zoom;
                    that.mouse.y = that.mouse.y*zoom;
                }
               
                if(haveMous && (that.mouse.x > min.x && that.mouse.x < max.x) && (that.mouse.y > min.y && that.mouse.y < max.y)){
                   item.mousToRect = !item.mousToRect;
                   data[i] = item;
                   break;
                }
            }
            that.draw(data);
        })
        //滚轮监听
        addEvent(node, "mousewheel", function(event) {
            if (event.delta < 0) { 
                that.zoom-=0.02
            }else{
                that.zoom+=0.02
            }
            that.draw(data)
        });
        
        this.elem = node;
        this.ctx = node.getContext('2d');
        img.onload = function () {
            that.draw(data)
        }
        callback && callback();

        // var newRect= new rect();
        // newRect.draw(this.ctx)
        return node;
    }
    myCan.prototype.draw =function(detail){
        this.ctx.clearRect(0,0,this.width,this.height);
        var that = this;
        
        var zoom = this.zoom;
        var rectArr = [];
       
        that.img = img;
        that.ctx.drawImage(that.img,0,0,img.width*that.zoom,img.height*that.zoom)
        detail.map((item,index)=>{
            var newRect = new rect();
            newRect.draw(that.ctx,detail[index],that.zoom);
            // rectArr.push(new rect())
        })
            
      
        
       
        
    }
    var newCan = new myCan();
    var app = document.getElementById("app")
    newCan.render(app);
    // newCan.draw()
    
  
    function dataFilter(){

    }
    // global.canvas = newCan;
    function listener(elem,callback){
       addEvent( elem,'mousedown', function (event) {
            var e = event || window.event;
            var mouse = {
                x:e.clientX,
                y:e.clientY
            }
            var elemDetail = elem.getBoundingClientRect();
            
            callback && callback({x:mouse.x-elemDetail.x,y:mouse.y-elemDetail.y})
        }, false);
    }

})(this)