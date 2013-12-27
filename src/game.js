var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 600;
var stage;

function keyHandler(e, isPressed) {
    switch (e.keyCode) {
        default: return false;
    }
    return true;
}

function handleKeyUp(e) {
    keyHandler(e, false);
}

function handleKeyDown(e) {

    /* prevent arrow keys from scrolling window */
    if (keyHandler(e, true)) {
        e.preventDefault();
    }

}

var mousex;
var mousey;

function handleMove(e) {
    mousex = e.x - offsetx;
    mousey = e.y - offsety;
}

function CenteredButton(text, x, y, color) {
    var _width = 100;
    var _height = 40;
    x = x - _width / 2;
    y = y - _height / 2;

    var title = new createjs.Text(text, '24px Helvetica', '#333');
    title.x = x;
    title.y = y;

    var box = new createjs.Shape(new createjs.Graphics().beginFill(color).drawRect(x, y, _width, _height));

    var button = new createjs.Container();
    button.addChild(box, title);
    this.shape = button;
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

    var startMenu = new createjs.Container();
    var title = new createjs.Text('MooseTrack', '35px Helvetica', '#333');
    title.x = CANVAS_WIDTH / 2 - 100;
    title.y = CANVAS_HEIGHT / 10;
    var startButton = new CenteredButton("Start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "#999")
    startMenu.addChild(
        new createjs.Shape(new createjs.Graphics().beginFill("#eee").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)),
        title,
        startButton.shape
    );

    var gameplay = new createjs.Container();

    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;

    circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, CIRCLE_RAD);
    circle.x = 100;
    circle.y = 100;
    gameplay.addChild(circle);

    score = new createjs.Text("0", "20px Arial", "#ff7700");
    score.x = 100;
    score.y = 100;

    gameplay.addChild(score);

    stage.addChild(startMenu);
    // stage.addChild(gameplay);
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
    if (dx <= CIRCLE_RAD && dy <= CIRCLE_RAD) {
        s++;
        score.text = s;
    }
    circle.x += 1;
    stage.update();
}