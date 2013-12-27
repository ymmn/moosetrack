function GameLevel(lvl) {

    ///////////////// CONSTANTS ////////////////
    /* states */
    var LEVEL_NAME = -1;
    var COUNTING_DOWN = -2;
    var PLAYING = -3;
    var DISPLAY_SCORE = -4;

    // TODO: move this elsewhere?
    var GAME_DIMS = {
        width: 1000,
        height: 800
    };

    /* state timers (measured in ticks) */
    var LEVEL_NAME_TIMER = 30;
    var DISPLAY_SCORE_TIMER = 80;
    var COUNT_DOWN_TIMER = 30;


    ////////////////  PRIVATE VARIABLES ///////////////
    var _levelNameContainer;
    var _gameplayContainer;
    var _finalScoreContainer;
    var _countdownContainer;
    var _bigContainer;
    var _state;
    var _levelDriver;
    var _levelNumber = lvl;
    var _playerScore = 0;
    var _possScore = 0;
    var _timer = 0;
    var _countdown = 3;


    ///////////////  PRIVATE METHODS ////////////////
    var _init = function () {
        _state = LEVEL_NAME;
        _levelDriver = new LevelDriver(_levelNumber);
        _bigContainer = new createjs.Container();

        /* make the ball */
        _circle = new createjs.Shape();
        _circle.graphics.beginFill("red").drawCircle(0, 0, CIRCLE_RAD);
        _circle.x = 100;
        _circle.y = 100;

        _levelDriver.setCircle(_circle);
        _levelNameContainer = _makeCenteredTextContainer(["Level " + _levelNumber]);
        _bigContainer.addChild(_levelNameContainer);
    };

    /**
     * Judge user input for this current tick.
     * Return true if user should get a point
     */
    var _mouseWithinBall = function () {
        var dx = Math.abs(mousex - _circle.x);
        var dy = Math.abs(mousey - _circle.y);
        return dx <= CIRCLE_RAD && dy <= CIRCLE_RAD;
    };

    /**
     * Returns a createjs container that has text at the center
     * of the game
     */
    var _makeCenteredTextContainer = function (lines) {
        /* put containter at center */
        var cont = new createjs.Container();
        cont.x = GAME_DIMS.width / 2;
        cont.y = GAME_DIMS.height / 2;

        for(var i = 0; i < lines.length; i++) {
            var txt = new createjs.Text(lines[i], "20px Arial", "#000");
            txt.x = 0;
            txt.y = i*20;

            cont.addChild(txt);
        }

        return cont;
    };


    /**
     * Initializes the final score container and adds it to the stage
     */
    var _makeScoreDisplay = function (finalScore, possScore, percentage) {
        var content = ["Final Score: " + finalScore + " / " + possScore];
        content.push(percentage + "%");
        _finalScoreContainer = _makeCenteredTextContainer(content);
        _bigContainer.addChild(_finalScoreContainer);
    };

    var _displayCountDown = function (cnt) {
        var content = "GO";
        if (cnt !== 0) {
            content = "" + cnt;
        }
        _countdownContainer = _makeCenteredTextContainer([content]);
        _bigContainer.addChild(_countdownContainer);
    };


    //////////////// PUBLIC METHODS //////////////
    this.tick = function () {
        if (_state == LEVEL_NAME) {
            if (_timer === LEVEL_NAME_TIMER) {
                _bigContainer.removeChild(_levelNameContainer);
                _state = COUNTING_DOWN;
                _bigContainer.addChild(_circle);
                _timer = 0;
            }
        } else if (_state == COUNTING_DOWN) {
            if (_timer === 0 || _timer === COUNT_DOWN_TIMER) {
                _bigContainer.removeChild(_countdownContainer);
                if (_countdown < 0) {
                    _state = PLAYING;
                } else {
                    _displayCountDown(_countdown);
                    _countdown--;
                }
                _timer = 0;
            }
        } else if (_state == PLAYING) {
            if (!_levelDriver.done()) {
                _levelDriver.play();
                if (_mouseWithinBall()) {
                    _playerScore++;
                }
                _possScore++;
            } else {
                var finalScore = _playerScore;
                var possScore = _possScore;
                // round to one decimal
                var percentage = Math.round((finalScore / possScore) * 1000) / 10;
                _makeScoreDisplay(finalScore, possScore, percentage);
                _state = DISPLAY_SCORE;
                _timer = 0;
            }
        } else if (_state == DISPLAY_SCORE) {
            if (_timer == DISPLAY_SCORE_TIMER) {
                nextLevel();
            }
        }
        _timer++;
        console.log(_state + ": " + _timer);
    };

    /**
     * the container that has the entire level
     */
    this.getContainer = function () {
        return _bigContainer;
    };

    _init();

}