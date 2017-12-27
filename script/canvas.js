
import utils from './utils';
import rect from "./rect";
import data from "./data";
(function(glbal){
    
    // function draw(){
    //     // console.log("draw",i++);
    //     // utils.loop(draw)
    // }
    

    var myCan = function(){
        var win = utils.getWindowDetil()
        this.width = win.width;
        this.height = win.height;
        this.elem = null;
        this.ctx = null;
    }
    myCan.prototype.render = function(elem,canDetail,callback){
        var node = document.createElement("canvas");
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
        var mouse =utils.captureTouch(node)
        this.elem = node;
        this.ctx = node.getContext('2d');
        
        callback && callback();

        // var newRect= new rect();
        // newRect.draw(this.ctx)
        return node;
    }
    myCan.prototype.draw =function(detail){
        var rectArr = [];
       
        
        detail.map((item,index)=>{
            var newRect = new rect();
            newRect.draw(this.ctx,detail[index]);
            rectArr.push(new rect())
        })
        
        // rectArr.map((item,index)=>{
        //    console.log(detail[index])
        //     item.draw(this.ctx,detail[index]);
        // })
    }
    var newCan = new myCan();
    var app = document.getElementById("app")
    newCan.render(app);
    // newCan.draw()
    newCan.draw(data)
  
    
    // global.canvas = newCan;


})(this)