var rect = function(){
    this.isclick = false;
}
rect.prototype.draw = function(cxt,data){
    console.log(this.click)
    cxt.fillStyle=this.isclick ? "#FF0000":"#000000";
    cxt.fillRect(data.x,data.y,data.width,data.height); 
}

export default rect;