///////////////// CONSTANTS ////////////////
var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var OFFSET_X;
var OFFSET_Y;
var CIRCLE_RAD = 20;
var GOAL_FPS = 30;



////////////////  GLOBAL VARIABLES ///////////////
var stage;
var mousex;
var mousey;
var curLevel;
var levelCnt = 0;
var startMenu;
var gameplayCont;
var circle;
var score;
var s = 0;
var game_state;
var mouseDown = false;



///////////////// HELPERS ////////////////
function CenteredButton(text, x, y, color) {
    var boxW = 100;
    var boxH = 40;

    var title = new createjs.Text(text, '24px Helvetica', '#333');
    title.x = x - title.getMeasuredWidth() / 2;
    title.y = y - title.getMeasuredHeight() / 2;

    var box = new createjs.Shape(new createjs.Graphics().beginFill(color).drawRect(x - boxW / 2, y - boxH / 2, boxW, boxH));

    var button = new createjs.Container();
    button.addChild(box, title);
    this.shape = button;

    this.isClicked = function () {
        var mx = mousex;
        var my = mousey;

        if (mx >= x - boxW / 2 && mx <= x + boxW / 2 && my >= y - boxH / 2 && my <= y + boxH / 2) {
            return true;
        }

        return false;
    };
}

function nextLevel() {
    if (curLevel !== undefined) {
        stage.removeChild(curLevel.getContainer());
    }
    levelCnt += 1;
    var l = (Object.keys(LEVELS).length + 1);
    if( levelCnt < l ) {
        console.log(levelCnt + " " + l );
        curLevel = new GameLevel(levelCnt);
        stage.addChild(curLevel.getContainer());
    } else {
        levelCnt = 0;
        curLevel = undefined;
        stage.addChild(startMenu);
        game_state = "Start Menu";
    }
}

function makeStartMenu() {
    var startMenu = new createjs.Container();
    var title = new createjs.Text('MooseTrack', '35px Helvetica', '#333');
    title.x = CANVAS_WIDTH / 2 - title.getMeasuredWidth() / 2;
    title.y = CANVAS_HEIGHT / 10;
    startMenu.startButton = new CenteredButton("Start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "#999");
    startMenu.addChild(
        new createjs.Shape(new createjs.Graphics().beginFill("#eee").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)),
        title,
        startMenu.startButton.shape
    );

    return startMenu;
}

function makeGameplayCont() {
    var gameplayCont = new createjs.Container();

    circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, CIRCLE_RAD);
    circle.x = 100;
    circle.y = 100;

    score = new createjs.Text("0", "20px Arial", "#ff7700");
    score.x = 100;
    score.y = 100;

    gameplayCont.addChild(circle, score);
    return gameplayCont;
}



///////////////// CORE ////////////////
function init() {

    /* initial game state */
    game_state = "Start Menu";

    /* define canvas dimension constants */
    var canvas = document.getElementById("gameCanvas");

    CANVAS_WIDTH = canvas.width;
    CANVAS_HEIGHT = canvas.height;
    OFFSET_X = canvas.offsetLeft;
    OFFSET_Y = canvas.offsetTop;


    /* register handlers */
    document.body.onmousemove = function (e) {
        mousex = e.x - OFFSET_X;
        mousey = e.y - OFFSET_Y;
    };
    document.body.onmousedown = function () {
        mouseDown = true;
    };
    document.body.onmouseup = function () {
        mouseDown = false;
    };


    /* create stage */
    stage = new createjs.Stage(canvas);


    /* start menu */
    startMenu = makeStartMenu();
    stage.addChild(startMenu);


    gameplayCont = makeGameplayCont(); //new createjs.Container();



    /* update stage to display everything */
    stage.update();

    /* start game timer */
    if (!createjs.Ticker.hasEventListener("tick")) {
        createjs.Ticker.addEventListener("tick", tick);
    }
    createjs.Ticker.setFPS(GOAL_FPS);

}


function tick(event) {
    if (game_state === "Start Menu") {
        console.log('baaah');
        var mouseOnStartBtn = startMenu.startButton.isClicked();
        if (mouseOnStartBtn && mouseDown) {
            console.log('bAM');
            stage.removeChild(startMenu);
            nextLevel();
            game_state = "Play";
        }
    } else if (game_state == "Play") {
        curLevel.tick();
    }
    stage.update();
}