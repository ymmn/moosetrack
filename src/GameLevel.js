function GameLevel(lvl) {

    ///////////////// CONSTANTS ////////////////
    /* states */
    var LEVEL_NAME = -1;
    var COUNTING_DOWN = -2;
    var PLAYING = -3;
    var DISPLAY_SCORE = -4;
    var REPLAY_AND_COUNT = -5;
    var PREVIEW = -6;

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
    var _playCircle;
    /* preview phase */
    var _previewCircle;
    var _previewLevelLine;

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

        /* background */
        var bgd = new createjs.Bitmap("assets/background.jpg");
        bgd.alpha = 0.25;
        _bigContainer.addChild(bgd);

        /* make the ball */
        _playCircle = new createjs.Shape();
        _playCircle.graphics.beginFill(CIRCLE_COLOR).drawCircle(0, 0, _circleRad);
        _replayCircle = new createjs.Shape();
        _replayCircle.graphics.beginStroke("black").drawCircle(0, 0, _circleRad);
        _replayCircle.alpha = 0.25;
        _previewCircle = new createjs.Shape();

        /* make player recording line */
        _playerRecordingLine = new createjs.Shape();
        var graphics = _playerRecordingLine.graphics;
        graphics.setStrokeStyle(3);
        graphics.beginStroke("black");

        /* make preview line */
        _previewLevelLine = new createjs.Shape();
        var graphics = _previewLevelLine.graphics;
        graphics.setStrokeStyle(3);
        graphics.beginStroke("green");

        /* make terrain shape */
        _terrainLine = new createjs.Shape();
        var graphics = _terrainLine.graphics;
        graphics.setStrokeStyle(1);
        graphics.beginStroke("black");

        _levelNameContainer = _makeCenteredTextContainer(["Level " + _levelNumber]).container;
        _bigContainer.addChild(_levelNameContainer);
    };

    /**
     * Judge user input for this current tick.
     * Return true if user should get a point
     */
    var _mouseWithinBall = function () {
        var dx = Math.abs(mousex - _playCircle.x);
        var dy = Math.abs(mousey - _playCircle.y);
        return dx <= _circleRad && dy <= _circleRad;
    };

    /**
     * Returns a createjs container that has text at the center
     * of the game
     */
    var _makeCenteredTextContainer = function (lines, color) {
        if( color === undefined ) {
            color = "#000";
        }
        /* put containter at center */
        var cont = new createjs.Container();
        cont.x = GAME_DIMS.width / 2;
        cont.y = GAME_DIMS.height / 2;

        var txt;
        for (var i = 0; i < lines.length; i++) {
            txt = new createjs.Text(lines[i], "20px Arial", color);
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
        _bigContainer.addChild(_makeCenteredTextContainer(content).container);

        content = [percentage + "%"];
        var grade = moosetrack.getGradeFromPercentage(percentage);
        content.push(grade);
        content.push(extra);
        _finalScoreContainer = _makeCenteredTextContainer(content, moosetrack.getScoreColor(percentage)).container;
        _finalScoreContainer.y += 50;
        _bigContainer.addChild(_finalScoreContainer);
    };

    var _createTerrain = function () {
        var terrain = LEVELS[_levelNumber].terrain;
        if (terrain !== undefined) {
            _terrainLine.graphics.moveTo(terrain[0].x(), terrain[0].y());
            for (var i = 1; i < terrain.length; i++) {
                _terrainLine.graphics.lineTo(terrain[i].x(), terrain[i].y());
                console.log(terrain[i].elements);
                console.log(terrain[0].elements);
            }
            // _bigContainer.addChild(_terrainLine);
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



    var _scorePhase = function () {
        /* draw the player's replay line*/
        var v = _playerRecording[_playerRecordingCnt];

        if( _timer % 3 === 0 ) {
            _playerRecordingLine.graphics.moveTo(v.x(), v.y());
        } else{
            _playerRecordingLine.graphics.lineTo(v.x(), v.y());
        }

        var ballColor = "black";

        /* move the ghost ball */
        _levelDriver.play();

        /* calculate percentage to tenth place */
        var percentage = Math.round((_accScore / (_possScore -1)) * 1000) / 10;

        /* count the players score */
        if (_playerScore[_playerRecordingCnt]) {
            _accScore++;
            _scoreTxt.text = "" + _accScore;
            _scoreTxt.color = moosetrack.getScoreColor(percentage);

            /* color ball red when player is scoring */
            ballColor = "red";

            /* play counting sound */
            createjs.Sound.play("count");
        }

        /* color ball based on hit or miss */
        _replayCircle.graphics.clear().beginFill(ballColor).drawCircle(0, 0, _circleRad);


        /* check if we're done */
        if (_playerRecordingCnt === _possScore) {
            /* yup! time to display total and stuff */
            _timer = 0;
            _state = DISPLAY_SCORE;

            /* prepare the message telling the user whether or not he passed */
            var extra = "";
            if (percentage >= PASSING_SCORE) {
                /* player passed, so unlock next level */
                unlocked_levels[current_difficulty][_levelNumber + 1] = true;
                extra = "You unlocked the next level!";
            } else {
                extra = "You need a C or above to unlock the next level";
            }

            /* record top score */
            var prevPercent = top_scores[current_difficulty][_levelNumber];
            if( prevPercent === undefined || percentage > prevPercent ) {
                top_scores[current_difficulty][_levelNumber] = percentage;
                /* save cookie */
                $.cookie('state', JSON.stringify({
                    top_scores: top_scores,
                    unlocked_levels: unlocked_levels
                }));
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
                _state = PREVIEW;
                /* init preview phase */
                _instructionsLabel = new createjs.Text("Track the ball with the mouse cursor", "28px silom", "#000");
                _instructionsLabel.x = CANVAS_WIDTH / 2;
                _instructionsLabel.y = 150;
                _instructionsLabel.textAlign = "center";
                _bigContainer.addChild(_instructionsLabel);
                /* set dummy circle */
                _levelDriver.setCircle(_previewCircle);
                /* initialize line */
                _previewLevelLine.graphics.moveTo(_previewCircle.x, _previewCircle.y);
                _bigContainer.addChild(_previewLevelLine);


                _createTerrain();
                _timer = 0;
            }
        } /* showing the player how this level goes as well as instructions */
        else if (_state == PREVIEW) {
            /* draw a line previewing the level's path */
            if( !_levelDriver.done() ) {
                _levelDriver.play();
                if( _timer % 3 == 0 ) {
                    _previewLevelLine.graphics.moveTo(_previewCircle.x, _previewCircle.y);
                } else {
                    _previewLevelLine.graphics.lineTo(_previewCircle.x, _previewCircle.y);
                }
            } else {
                _bigContainer.removeChild(_instructionsLabel);
                _levelDriver.setCircle(_playCircle);
                _bigContainer.addChild(_playCircle);
                _state = COUNTING_DOWN;
                _timer = 0;
            }
        } /* Counting down for the game to start*/
        else if (_state == COUNTING_DOWN) {
            /* Once timer is reached, Count down one more time */
            if (_timer === 0 || _timer === COUNT_DOWN_TIMER) {
                _bigContainer.removeChild(_countdownContainer);
                /* already counted to 0. Start the game! */
                if (_countdown < 0) {
                    _state = PLAYING;
                } else {
                    /* still more numbers left to count */
                    if(_countdown === 0) {
                        /* GO! */
                        createjs.Sound.play("start-playing");
                    } else {
                        /* just a number */
                        createjs.Sound.play("countdown");
                    }

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
                _previewLevelLine.alpha = 0.2;
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