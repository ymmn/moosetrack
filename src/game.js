///////////////// CONSTANTS ////////////////
var CANVAS_WIDTH = 960;
var CANVAS_HEIGHT = 640;
var OFFSET_X;
var OFFSET_Y;
var CIRCLE_RAD = [30, 15, 7, 4];
var GOAL_FPS = 30;
var PASSING_SCORE = 70;
var DIFFICULTIES = ["Easy", "Intermediate", "Expert", "Insane"];

/* states */
var START_MENU = -100;
var PLAYING = -101;


////////////////  GLOBAL VARIABLES ///////////////
var stage;
/* input */
var mousex;
var mousey;
var mouseDown = false;
/* game state */
var curLevel;
var startMenu;
var game_state;
var current_difficulty = 0;
var unlocked_levels = [{ 1: true }, {1: true}, {1: true}, {1: true}];



///////////////// HELPERS ////////////////
function startLevel(lvl) {
    stage.removeChild(startMenu.getContainer());
    game_state = PLAYING;
    if (curLevel !== undefined) {
        stage.removeChild(curLevel.getContainer());
    }
    var l = (Object.keys(LEVELS).length + 1);
    console.log(lvl);
    if( lvl < l ) {
        curLevel = new GameLevel(lvl);
        stage.addChild(curLevel.getContainer());
    } else {
        stage.addChild(startMenu.getContainer());
        game_state = START_MENU;
    }
}

function gotoStartMenu() {
    game_state = START_MENU;
    startMenu.refresh();
    if(curLevel !== undefined) {
        stage.removeChild(curLevel.getContainer());
    }
    stage.addChild(startMenu.getContainer());
}


///////////////// CORE ////////////////
function init() {


    /* define canvas dimension constants */
    var canvas = document.getElementById("gameCanvas");

    OFFSET_X = canvas.offsetLeft;
    OFFSET_Y = canvas.offsetTop;


    /* initial game state */
    game_state = START_MENU;


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

    /* background */
    stage.addChild(new createjs.Shape(new createjs.Graphics().beginFill("#eee").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)));

    /* start menu */
    startMenu = new StartMenu();


    /* start game timer */
    if (!createjs.Ticker.hasEventListener("tick")) {
        createjs.Ticker.addEventListener("tick", tick);
    }
    createjs.Ticker.setFPS(GOAL_FPS);


    gotoStartMenu();

}



function tick(event) {
    if (game_state === START_MENU) {
        startMenu.tick();
    } else if (game_state === PLAYING) {
        curLevel.tick();
    }
    stage.update();
}