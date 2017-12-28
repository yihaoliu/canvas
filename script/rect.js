var rect = function(){
    this.isclick = false;
}
rect.prototype.draw = function(cxt,data,zoom){
   
    cxt.fillStyle=data.mousToRect? "#FF0000":"#000000";
    cxt.fillRect(data.x*zoom,data.y*zoom,data.width*zoom,data.height*zoom); 
}

export default rect;