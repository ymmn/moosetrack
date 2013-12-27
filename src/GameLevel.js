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
    var _playerScore = Array(1000);
    var _possScore = 0;
    var _playerRecordingCnt = 1;
    var _playerRecording = Array(1000);
    var _playerRecordingLine;
    var _scoreTxt;
    var _replayCircle;
    var _accScore = 0;
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
        _replayCircle = new createjs.Shape();
        _replayCircle.graphics.beginStroke("black").drawCircle(0, 0, CIRCLE_RAD);

        /* make player recording line */
        _playerRecordingLine = new createjs.Shape();
        var graphics = _playerRecordingLine.graphics;
        graphics.setStrokeStyle(1);
        graphics.beginStroke("black");

        _levelDriver.setCircle(_circle);
        _levelNameContainer = _makeCenteredTextContainer(["Level " + _levelNumber]).container;
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

        var txt;
        for (var i = 0; i < lines.length; i++) {
            txt = new createjs.Text(lines[i], "20px Arial", "#000");
            txt.x = 0;
            txt.y = i * 20;

            cont.addChild(txt);
        }

        return {
            container: cont,
            text: txt
        };
    };


    /**
     * Initializes the final score container and adds it to the stage
     */
    var _makeScoreDisplay = function (finalScore, possScore, percentage) {
        var content = ["Final Score: " + finalScore + " / " + possScore];
        content.push(percentage + "%");
        _finalScoreContainer = _makeCenteredTextContainer(content).container;
        _bigContainer.addChild(_finalScoreContainer);
    };

    var _displayCountDown = function (cnt) {
        var content = "GO";
        if (cnt !== 0) {
            content = "" + cnt;
        }
        _countdownContainer = _makeCenteredTextContainer([content]).container;
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
                _playerScore[_possScore] = _mouseWithinBall();
                _playerRecording[_possScore] = $V([mousex, mousey]);
                _levelDriver.play();
                _possScore++;
            } else {
                // round to one decimal
                // _makeScoreDisplay(finalScore, possScore, percentage);
                _state = DISPLAY_SCORE;
                _timer = 0;
                _playerRecordingLine.graphics.moveTo(_playerRecording[0].x(), _playerRecording[0].y());
                _bigContainer.addChild(_playerRecordingLine);
                _bigContainer.addChild(_replayCircle);
                _levelDriver.setCircle(_replayCircle);
                var tc = _makeCenteredTextContainer(["" + 0]);
                _scoreTxt = tc.text;
                _finalScoreContainer = tc.container
                _bigContainer.addChild(_finalScoreContainer);
            }
        } else if (_state == DISPLAY_SCORE) {
            if (_playerRecordingCnt < _possScore) {
                var v = _playerRecording[_playerRecordingCnt];
                _playerRecordingLine.graphics.lineTo(v.x(), v.y());
                _playerRecordingCnt++;
                _levelDriver.play();
                if (_playerScore[_playerRecordingCnt]) {
                    _accScore++;
                    _scoreTxt.text = "" + _accScore;
                }
                if (_playerRecordingCnt === _possScore) {
                    _timer = 0;
                    var percentage = Math.round((_accScore / _possScore) * 1000) / 10;
                    _bigContainer.removeChild(_finalScoreContainer);
                    _makeScoreDisplay(_accScore, _possScore, percentage);
                }
            } else {
                if (_timer == DISPLAY_SCORE_TIMER) {
                    nextLevel();
                }
            }
        }
        _timer++;
    };

    /**
     * the container that has the entire level
     */
    this.getContainer = function () {
        return _bigContainer;
    };

    _init();

}