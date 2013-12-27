function GameLevel() {

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
    var LEVEL_NAME_TIMER = 10;
    var DISPLAY_SCORE_TIMER = 10;
    var COUNT_DOWN_TIMER = 10;


    ////////////////  PRIVATE VARIABLES ///////////////
    var _levelNameContainer;
    var _gameplayContainer;
    var _finalScoreContainer;
    var _countdownContainer;
    var _bigContainer;
    var _state;
    var _levelDriver;
    var _levelNumber;
    var _timer = 0;
    var _countdown = 3;


    ///////////////  PRIVATE METHODS ////////////////
    var _init = function () {
        _state = LEVEL_NAME;
        _levelDriver = new LevelDriver(_gameplayContainer);
        _bigContainer = new createjs.Container();

        _levelNameContainer = _makeCenteredTextContainer("Level " + _levelNumber);
        _bigContainer.addChild(_levelNameContainer);
    };

    /**
     * Returns a createjs container that has text at the center
     * of the game
     */
    var _makeCenteredTextContainer = function (content) {
        /* put containter at center */
        var cont = new createjs.Container();
        cont.x = GAME_DIMS.width / 2;
        cont.y = GAME_DIMS.height / 2;

        var txt = new createjs.Text(content, "20px Arial", "#000");
        txt.x = 0;
        txt.y = 0;

        cont.addChild(txt);

        return cont;
    };


    /**
     * Initializes the final score container and adds it to the stage
     */
    var _makeScoreDisplay = function (finalScore, possScore, percentage) {
        var content = "Final Score: " + finalScore + " / " + possScore + "\n";
        content += "" + percentage + "\n";
        _finalScoreContainer = _makeCenteredTextContainer(content);
        _bigContainer.addChild(_finalScoreContainer);
    };

    var _displayCountDown = function (cnt) {
        var content = "GO";
        if (cnt !== 0) {
            content = "" + cnt;
        }
        _countdownContainer = _makeCenteredTextContainer(content);
        _bigContainer.addChild(_countdownContainer);
    };


    //////////////// PUBLIC METHODS //////////////
    this.tick = function () {
        if (_state == LEVEL_NAME) {
            if (_timer === LEVEL_NAME_TIMER) {
                _bigContainer.removeChild(_levelNameContainer);
                _state = COUNTING_DOWN;
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
            } else {
                var finalScore = _levelDriver.score;
                var possScore = _levelDriver.possibleScore;
                // round to one decimal
                var percentage = Math.round((finalScore / possScore) * 1000) / 10;
                _makeScoreDisplay(finalScore, possScore, percentage);
                _state = DISPLAY_SCORE;
                _timer = 0;
            }
        } else if (_state == DISPLAY_SCORE) {
            if (_timer == DISPLAY_SCORE_TIMER) {

                _timer = 0;
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