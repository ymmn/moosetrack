function GameLevel(lvl) {

    ///////////////// CONSTANTS ////////////////
    /* states */
    var LEVEL_NAME = -1;
    var COUNTING_DOWN = -2;
    var PLAYING = -3;
    var DISPLAY_SCORE = -4;
    var REPLAY_AND_COUNT = -5;

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
    var _terrainLine;
    var _scoreTxt;
    var _replayCircle;
    var _accScore = 0;
    var _timer = 0;
    var _countdown = 3;
    var _circleRad = CIRCLE_RAD[current_difficulty];


    ///////////////  PRIVATE METHODS ////////////////
    var _init = function () {
        _state = LEVEL_NAME;
        _levelDriver = new LevelDriver(_levelNumber);
        _bigContainer = new createjs.Container();

        /* make the ball */
        _circle = new createjs.Shape();
        _circle.graphics.beginFill(CIRCLE_COLOR).drawCircle(0, 0, _circleRad);
        _replayCircle = new createjs.Shape();
        _replayCircle.graphics.beginStroke("black").drawCircle(0, 0, _circleRad);

        /* make player recording line */
        _playerRecordingLine = new createjs.Shape();
        var graphics = _playerRecordingLine.graphics;
        graphics.setStrokeStyle(1);
        graphics.beginStroke("black");

        /* make terrain shape */
        _terrainLine = new createjs.Shape();
        var graphics = _terrainLine.graphics;
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
        return dx <= _circleRad && dy <= _circleRad;
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
            txt.textAlign = "center";
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
    var _makeScoreDisplay = function (finalScore, possScore, percentage, extra) {
        var content = ["Final Score: " + finalScore + " / " + possScore];
        content.push(percentage + "%");
        var grade = "F";
        if(percentage > 98) {
            grade = "A+";
        } else if(percentage > 90) {
            grade = "A";
        } else if(percentage > 80) {
            grade = "B";
        } else if(percentage > 70) {
            grade = "C";
        } else if(percentage > 60) {
            grade = "D";
        }
        content.push(grade);
        content.push(extra);
        _finalScoreContainer = _makeCenteredTextContainer(content).container;
        _bigContainer.addChild(_finalScoreContainer);
    };

    var _createTerrain = function() {
        var terrain = LEVELS[_levelNumber].terrain;
        if(terrain !== undefined) {
            _terrainLine.graphics.moveTo(terrain[0].x(), terrain[0].y());
            for(var i = 1; i < terrain.length; i++) {
                _terrainLine.graphics.lineTo(terrain[i].x(), terrain[i].y());
                console.log(terrain[i].elements);
                console.log(terrain[0].elements);
            }
            _bigContainer.addChild(_terrainLine);
        }
    };

    var _displayCountDown = function (cnt) {
        var content = "GO";
        if (cnt !== 0) {
            content = "" + cnt;
        }
        _countdownContainer = _makeCenteredTextContainer([content]).container;
        _bigContainer.addChild(_countdownContainer);
    };

    var _scorePhase = function() {
        /* draw the player's replay line*/
        var v = _playerRecording[_playerRecordingCnt];
        _playerRecordingLine.graphics.lineTo(v.x(), v.y());

        /* move the ghost ball */
        _levelDriver.play();

        /* count the players score */
        if (_playerScore[_playerRecordingCnt]) {
            _accScore++;
            _scoreTxt.text = "" + _accScore;
        }


        /* check if we're done */
        if (_playerRecordingCnt === _possScore) {
            /* yup! time to display total and stuff */
            _timer = 0;
            _state = DISPLAY_SCORE;

            /* calculate percentage to tenth place */
            var percentage = Math.round((_accScore / _possScore) * 1000) / 10;

            /* prepare the message telling the user whether or not he passed */
            var extra = "";
            if( percentage >= PASSING_SCORE ) {
               unlocked_levels[current_difficulty][_levelNumber + 1 ]  = true;
               extra = "You unlocked the next level!";
            } else {
               extra = "You need a C or above to unlock the next level";
            }

            /* refresh score display */
            _bigContainer.removeChild(_finalScoreContainer);
            _makeScoreDisplay(_accScore, _possScore, percentage, extra);
        }

        _playerRecordingCnt++;
    };


    //////////////// PUBLIC METHODS //////////////
    this.tick = function () {
        /* displaying the name of the level */
        if (_state == LEVEL_NAME) {
            /* move on to next state once timer is reached */
            if (_timer === LEVEL_NAME_TIMER) {
                _bigContainer.removeChild(_levelNameContainer);
                _state = COUNTING_DOWN;
                _bigContainer.addChild(_circle);
                _createTerrain();
                _timer = 0;
            }
        }  /* Counting down for the game to start*/
        else if (_state == COUNTING_DOWN) {
            /* Once timer is reached, Count down one more time */
            if (_timer === 0 || _timer === COUNT_DOWN_TIMER) {
                _bigContainer.removeChild(_countdownContainer);
                /* already counted to 0. Start the game! */
                if (_countdown < 0) {
                    _state = PLAYING;
                } else {
                    /* still more numbers left to count */
                    _displayCountDown(_countdown);
                    _countdown--;
                }
                _timer = 0;
            }
        } /* Player is playing the game */
        else if (_state == PLAYING) {
            /* if the level is still going, record user input, and move ball */
            if (!_levelDriver.done()) {
                _playerScore[_possScore] = _mouseWithinBall();
                _playerRecording[_possScore] = $V([mousex, mousey]);
                _levelDriver.play();
                _possScore++;
            } else {
                /* we're done! now setup to start the replay phase */
                _state = REPLAY_AND_COUNT;
                _possScore--;
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
        } /* replaying user input and counting score */
        else if (_state == REPLAY_AND_COUNT) {
            _scorePhase();
        } /* showing user the final score and grade */
        else if (_state == DISPLAY_SCORE) {
            if (_timer == DISPLAY_SCORE_TIMER) {
                moosetrack.gotoStartMenu();
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