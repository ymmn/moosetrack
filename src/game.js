var stage;

function keyHandler(e, isPressed){
    switch (e.keyCode) {
    default:
        return false;
    }
    return true;
}

function handleKeyUp(e) {
    keyHandler(e, false);
}

function handleKeyDown(e) {
    
    /* prevent arrow keys from scrolling window */
    if( keyHandler(e, true) ) {
        e.preventDefault();
    }

}

var mousex;
var mousey;
function handleMove(e){
	mousex = e.x - offsetx;	
	mousey = e.y - offsety;
}

var offsetx;
var offsety;
var circle;
var CIRCLE_RAD = 50;
var score;
var s = 0;

function init() {

    // get a reference to the canvas we'll be working with:
    var canvas = document.getElementById("gameCanvas");

	offsetx = canvas.offsetLeft;
	offsety = canvas.offsetTop;
    // create a stage object to work with the canvas. This is the top level node in the display list:
    stage = new createjs.Stage(canvas);

    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;

	circle = new createjs.Shape();
	circle.graphics.beginFill("red").drawCircle(0, 0, CIRCLE_RAD);
	circle.x = 100;
	circle.y = 100;
	stage.addChild(circle);


	 score = new createjs.Text("0", "20px Arial", "#ff7700");
	 score.x = 100;
	 score.y = 100;

	stage.addChild(score);

    // call update on the stage to make it render the current display list to the canvas:
    stage.update();

    //start game timer   
    if (!createjs.Ticker.hasEventListener("tick")) {
        createjs.Ticker.addEventListener("tick", tick);
    }

    window.addEventListener("mousemove", handleMove);

    createjs.Ticker.setFPS(30);

}

function tick(event) {
	var dx = Math.abs(mousex - circle.x);
	var dy = Math.abs(mousey - circle.y);
	//console.log("dy " + dy);
	if( dx <= CIRCLE_RAD && dy <= CIRCLE_RAD ) {
		s++;
		score.text = s;
	}
    circle.x += 1;
    stage.update();
}

