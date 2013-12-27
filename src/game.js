///////////////// CONSTANTS ////////////////
var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var CIRCLE_RAD = 50;
var OFFSET_X;
var OFFSET_Y;
var GOAL_FPS = 30;



////////////////  GLOBAL VARIABLES ///////////////
var stage;
var mousex;
var mousey;
var curLevel;
var levelCnt = 0;
var startMenu;
var circle;
var score;
var s = 0;



///////////////// HELPERS ////////////////
function handleMove(e) {
    mousex = e.x - OFFSET_X;
    mousey = e.y - OFFSET_Y;
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

function nextLevel() {
    stage.removeChild(startMenu);
    levelCnt += 1;
    curLevel = new GameLevel(levelCnt);
    stage.addChild(curLevel.getContainer());
}




///////////////// CORE ////////////////
function init() {

    /* define canvas dimension constants */
    var canvas = document.getElementById("gameCanvas");

    CANVAS_WIDTH = canvas.width;
    CANVAS_HEIGHT = canvas.height;
    OFFSET_X = canvas.offsetLeft;
    OFFSET_Y = canvas.offsetTop;


    /* register handlers */
    window.addEventListener("mousemove", handleMove);


    /* create stage */
    stage = new createjs.Stage(canvas);


    /* start menu */
    startMenu = new createjs.Container();
    var title = new createjs.Text('MooseTrack', '35px Helvetica', '#333');
    title.x = CANVAS_WIDTH / 2 - 100;
    title.y = CANVAS_HEIGHT / 10;
    var startButton = new CenteredButton("Start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "#999")
    startMenu.addChild(
        new createjs.Shape(new createjs.Graphics().beginFill("#eee").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)),
        title,
        startButton.shape
    );

    stage.addChild(startMenu);

    /* update stage to display everything */
    stage.update();

    /* start game timer */
    if (!createjs.Ticker.hasEventListener("tick")) {
        createjs.Ticker.addEventListener("tick", tick);
    }
    createjs.Ticker.setFPS(GOAL_FPS);



    // var gameplay = new createjs.Container();


    // circle = new createjs.Shape();
    // circle.graphics.beginFill("red").drawCircle(0, 0, CIRCLE_RAD);
    // circle.x = 100;
    // circle.y = 100;
    // gameplay.addChild(circle);

    // score = new createjs.Text("0", "20px Arial", "#ff7700");
    // score.x = 100;
    // score.y = 100;

    // gameplay.addChild(score);

    // stage.addChild(gameplay);

}


function tick(event) {
    if (curLevel !== undefined) {
        curLevel.tick();
    }
    // var dx = Math.abs(mousex - circle.x);
    // var dy = Math.abs(mousey - circle.y);
    // //console.log("dy " + dy);
    // if (dx <= CIRCLE_RAD && dy <= CIRCLE_RAD) {
    //     s++;
    //     score.text = s;
    // }
    // circle.x += 1;
    stage.update();
}