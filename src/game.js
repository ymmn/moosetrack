///////////////// CONSTANTS ////////////////
var CANVAS_WIDTH = 960;
var CANVAS_HEIGHT = 640;
var OFFSET_X;
var OFFSET_Y;
var CIRCLE_RAD = [30, 15, 7, 4];
var GOAL_FPS = 30;
var PASSING_SCORE = 70;
var DIFFICULTIES = ["Easy", "Intermediate", "Expert", "Insane"];


////////////////  GLOBAL VARIABLES ///////////////
/* input */
var mousex;
var mousey;
var mouseDown = false;

/* game state */
var current_difficulty = 0;
var unlocked_levels = [{ 1: true, 2:true }, {1: true}, {1: true}, {1: true}];



var moosetrack = function() {

    ////////////////  PRIVATE VARIABLES ///////////////
    /* states */
    var START_MENU = -100;
    var PLAYING = -101;

    var _game_state;
    var _curLevel;
    var _startMenu;
    var _stage;


    /* holds public methods */
    var p = {};


    ///////////////// HELPERS ////////////////
    p.startLevel = function(lvl) {
        _stage.removeChild(_startMenu.getContainer());
        _game_state = PLAYING;
        if (_curLevel !== undefined) {
            _stage.removeChild(_curLevel.getContainer());
        }
        var l = (Object.keys(LEVELS).length + 1);
        console.log(lvl);
        if( lvl < l ) {
            _curLevel = new GameLevel(lvl);
            _stage.addChild(_curLevel.getContainer());
        } else {
            _stage.addChild(_startMenu.getContainer());
            _game_state = START_MENU;
        }
    };

    p.gotoStartMenu = function() {
        _game_state = START_MENU;
        _startMenu.refresh();
        if(_curLevel !== undefined) {
            _stage.removeChild(_curLevel.getContainer());
        }
        _stage.addChild(_startMenu.getContainer());
    };


    ///////////////// CORE ////////////////
    p.init = function() {


        /* define canvas dimension constants */
        var canvas = document.getElementById("gameCanvas");

        OFFSET_X = canvas.offsetLeft;
        OFFSET_Y = canvas.offsetTop;


        /* initial game state */
        _game_state = START_MENU;


        /* register handlers */
        document.body.onmousemove = function (e) {
            mousex = e.x - OFFSET_X + window.scrollX;
            mousey = e.y - OFFSET_Y + window.scrollY;
        };
        document.body.onmousedown = function () {
            mouseDown = true;
        };
        document.body.onmouseup = function () {
            mouseDown = false;
        };


        /* create _stage */
        _stage = new createjs.Stage(canvas);

        /* background */
        _stage.addChild(new createjs.Shape(new createjs.Graphics().beginFill("#eee").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)));

        /* start menu */
        _startMenu = new StartMenu();


        /* start game timer */
        if (!createjs.Ticker.hasEventListener("tick")) {
            createjs.Ticker.addEventListener("tick", _tick);
        }
        createjs.Ticker.setFPS(GOAL_FPS);


        p.gotoStartMenu();

    };


    var _tick = function(event) {
        if (_game_state === START_MENU) {
            _startMenu.tick();
        } else if (_game_state === PLAYING) {
            _curLevel.tick();
        }
        _stage.update();
    };

    return p;

}();