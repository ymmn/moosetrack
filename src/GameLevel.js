function GameLevel(lvl) {

    ///////////////// CONSTANTS ////////////////
    /* states */
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
    var _bigContainer;
    var _state;
    var _levelDriver;
    var _levelNumber = lvl;
    var _playerScore = Array(1000);
    var _possScore = 0;
    var _playerRecordingCnt = 1;
    var _playerRecording = Array(1000);
    var _ballRecording = Array(1000);
    var _playerRecordingLine;
    var _playCircle;
    var _flashingText;
    /* preview phase */
    var _previewCircle;
    var _previewLevelLine;
    var _previewMouseCursor;
    var _instructionsLabel;

    /* countdown phase */
    var _startPlayLabel;

    var _scoreTxt;
    var _replayCircle;
    var _accScore = 0;
    var _totalScoreOnDifficulty;
    var _timer = 0;
    var _circleRad = CIRCLE_RAD[moosetrack.current_difficulty];


    ///////////////  PRIVATE METHODS ////////////////
    function RoundedButton(x, y, color, text, textColor, onclick) {

        var w = 100;
        var h = 40;

        this.container = new createjs.Container();
        var rect = new createjs.Shape();
        rect.graphics.beginFill(color).drawRoundRect(x, y, w, h, 5);
        var cjText = new createjs.Text(text, "16px Letter Gothic Std bold", textColor);
        cjText.textAlign = "center";
        cjText.x = x + (w/2);
        cjText.y = y + (h/2) - 10;
        this.container.addChild(rect);
        this.container.addChild(cjText);

        this.container.addEventListener("click", onclick);

    }

    var _init = function () {
        _state = PREVIEW;
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
        _previewCircle.graphics.beginFill("black").drawCircle(0, 0, _circleRad);
        _previewCircle.alpha = 0.25;

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

        /* retry button */
        _retryBtn = new RoundedButton(330, 540, "#333", "Retry", "white", function(){
            moosetrack.startLevel(_levelNumber);
            // /* reset ball position */
            // _levelDriver.setCircle(_playCircle);

            // /* remove replay components */
            // _bigContainer.removeChild(_playerRecordingLine);
            // _bigContainer.removeChild(_replayCircle);

            // /* remove final score components */
            // _bigContainer.removeChild(_finalScoreContainer);
            // _bigContainer.removeChild(_retryBtn.container);
            // _bigContainer.removeChild(_backToLvlsBtn.container);

            // /* add instructions again */
            // _bigContainer.addChild(_instructionsLabel);

            // /* reset game state to ready */
            // _state = COUNTING_DOWN;

            /* reset score */
            // _possScore = 0;
            // _accScore = 0;

        });

        /* back to menu button */
        _backToLvlsBtn = new RoundedButton(550, 540, "#333", "Menu", "white", function(){
            moosetrack.gotoStartMenu();
        });

        /* preview mouse cursor */
        _previewMouseCursor = new createjs.Bitmap("assets/mouse.png");


        /* init preview phase */
        _instructionsLabel = new createjs.Text("Track the ball with the mouse cursor", "28px Letter Gothic Std", "#000");
        _instructionsLabel.x = CANVAS_WIDTH / 2;
        _instructionsLabel.y = 150;
        _instructionsLabel.textAlign = "center";
        _bigContainer.addChild(_instructionsLabel);
        /* set dummy circle */
        _levelDriver.setCircle(_previewCircle);
        /* initialize line */
        _previewLevelLine.graphics.moveTo(_previewCircle.x, _previewCircle.y);
        _bigContainer.addChild(_previewLevelLine);
        _bigContainer.addChild(_previewMouseCursor);
        _bigContainer.addChild(_previewCircle);
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

    var _flashText = function (txt) {
        if(_flashingText === undefined){
            _flashingText = new createjs.Text(txt, "28px Letter Gothic Std bold", "black");
            _flashingText.textAlign = "center";
            _flashingText.x = CANVAS_WIDTH / 2;
            _flashingText.y = 20;
            _bigContainer.addChild(_flashingText);
        }
        _flashingText.text = txt;
        if(_timer % 30 > 20) {
            _flashingText.alpha = 0;
        } else {
            _flashingText.alpha = 1;
        }
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
    var _makeScoreDisplay = function (finalScore, possScore, percentage, didSetHighScore) {
        var content = ["Final Score: " + finalScore + " / " + possScore];
        _finalScoreContainer = new createjs.Container();
        // _finalScoreContainer.addChild(_makeCenteredTextContainer(content).container);

        content = ["Score: " + percentage + "%"];
        var grade = moosetrack.getGradeFromPercentage(percentage);
        content.push("Grade: " + grade);
        content.push("Total score on " + DIFFICULTIES[moosetrack.current_difficulty].toUpperCase() + ": " + _totalScoreOnDifficulty);
        if(didSetHighScore) {
            content.push("You set a high score on the leaderboard!");
        } else {
            content.push("You need a total score of " + (moosetrack.leaderboardCutoff[moosetrack.current_difficulty] + 1) + " for the leaderboard");
        }
        var ctc = _makeCenteredTextContainer(content, moosetrack.getScoreColor(percentage)).container;
        ctc.y += 50;
        _finalScoreContainer.addChild(ctc);
        _bigContainer.addChild(_finalScoreContainer);

        _bigContainer.addChild(_retryBtn.container);
        _bigContainer.addChild(_backToLvlsBtn.container);
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
        _replayCircle.x = _ballRecording[_playerRecordingCnt].x();
        _replayCircle.y = _ballRecording[_playerRecordingCnt].y();

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

        _flashText("INSTANT REPLAY");

        /* color ball based on hit or miss */
        _replayCircle.graphics.clear().beginFill(ballColor).drawCircle(0, 0, _circleRad);


        /* check if we're done */
        if (_playerRecordingCnt === _possScore) {
            /* yup! time to display total and stuff */
            _timer = 0;
            _state = DISPLAY_SCORE;

            _bigContainer.removeChild(_flashingText);

            /* prepare the message telling the user whether or not he passed */
            var extra = "";
            if (percentage >= PASSING_SCORE) {
                /* player passed, so unlock next level */
                // unlocked_levels[moosetrack.current_difficulty][_levelNumber + 1] = true;
                // extra = "You unlocked the next level!";
            } else {
                // extra = "You need a C or above to unlock the next level";
            }

            /* increment rounds played */
            moosetrack.num_rounds++;

            /* played 10 rounds achievement */
            if(moosetrack.num_rounds === 10) {
               var achievement = new Clay.Achievement( { id: 2865 } );
                achievement.award( function( response ) {
                    // Optional callback on completion
                    // console.log( response );
                } );
            }

            /* periodically ask players to invite on fb */
            if((moosetrack.num_rounds - 1) % 10 === 0) {
                // Clay.Facebook.invite();
            }


            /* record top score */
            var scores = moosetrack.top_scores[moosetrack.current_difficulty];
            var prevPercent = scores[_levelNumber];
            if( prevPercent === undefined || percentage > prevPercent ) {
                scores[_levelNumber] = percentage;
            }

            /* now calculate accumulative score */
            _totalScoreOnDifficulty = moosetrack.calculateAccScoreForDifficulty();
            // console.log('acc is ' + _totalScoreOnDifficulty);

            /* update leaderboard */
            var cutoffs = moosetrack.leaderboardCutoff;
            var didSetHighScore = false;
            if( _totalScoreOnDifficulty > cutoffs[moosetrack.current_difficulty] ) {
                // console.log("updating");
                didSetHighScore = true;
                cutoffs[moosetrack.current_difficulty] = _totalScoreOnDifficulty;
                var leaderboard = new Clay.Leaderboard( { id: 3330 + moosetrack.current_difficulty } );
                leaderboard.post( { score: _totalScoreOnDifficulty }, function( response ) {
                    // Callback
                    // console.log( response );
                } );
            }

            /* save cookie */
            moosetrack.highestScores[moosetrack.current_difficulty] = Math.max(_totalScoreOnDifficulty, moosetrack.highestScores[moosetrack.current_difficulty]);
            $.cookie('state', JSON.stringify({
                top_scores: moosetrack.top_scores,
                num_rounds: moosetrack.num_rounds,
                highestScores: moosetrack.highestScores
            }));


            /* refresh score display */
            _bigContainer.removeChild(_finalScoreContainer);
            _makeScoreDisplay(_accScore, _possScore, percentage, didSetHighScore);
        }

        _playerRecordingCnt++;
    };


    //////////////// PUBLIC METHODS //////////////
    this.tick = function () {
         /* showing the player how this level goes as well as instructions */
        if (_state == PREVIEW) {
            /* draw a line previewing the level's path */
            var doneWithPreview = false;
            if( _levelDriver.noPreview() ){
                if(_timer >= 30) {
                    doneWithPreview = true;
                }
            } else{
                if( !_levelDriver.done() ) {
                    /* move the circle */
                    _levelDriver.play();

                    /* move mouse cursor */
                    _previewMouseCursor.x = _previewCircle.x - (_previewMouseCursor.image.width / 2);
                    _previewMouseCursor.y = _previewCircle.y;

                    /* draw dashed line */
                    if( _timer % 3 === 0 ) {
                        _previewLevelLine.graphics.moveTo(_previewCircle.x, _previewCircle.y);
                    } else {
                        _previewLevelLine.graphics.lineTo(_previewCircle.x, _previewCircle.y);
                    }
                } else {
                    doneWithPreview = true;
                }
            }
            _flashText("PREVIEW");

            if(doneWithPreview) {
                _levelDriver.setCircle(_playCircle);
                _bigContainer.addChild(_playCircle);

                /* add ball click listener */
                _playCircle.addEventListener("click", function(){
                    if( _state == COUNTING_DOWN ) {
                        _state = PLAYING;
                        _bigContainer.removeChild(_instructionsLabel);
                        _bigContainer.removeChild(_startPlayLabel);
                    }
                });

                /* label to tell player to click ball */
                _startPlayLabel = new createjs.Text("Now it's your turn!\n\nClick the ball to start", "28px Letter Gothic Std", "#000");
                _startPlayLabel.x = CANVAS_WIDTH / 2;
                _startPlayLabel.y = 250;
                _startPlayLabel.textAlign = "center";
                _bigContainer.addChild(_startPlayLabel);
                /* remove cursor and preview circle */
                _bigContainer.removeChild(_previewMouseCursor);
                _bigContainer.removeChild(_previewCircle);
                _bigContainer.removeChild(_flashingText);


                _state = COUNTING_DOWN;
            }
        } /* Counting down for the game to start*/
        else if (_state == COUNTING_DOWN) {
            /* just wait for player to click circle */
        } /* Player is playing the game */
        else if (_state == PLAYING) {
            /* if the level is still going, record user input, and move ball */
            if (!_levelDriver.done()) {
                _playerScore[_possScore] = _mouseWithinBall();
                _playerRecording[_possScore] = $V([mousex, mousey]);
                _ballRecording[_possScore] = $V([_playCircle.x, _playCircle.y]);
                _levelDriver.play();
                _possScore++;
            } else {
                /* we're done! now setup to start the replay phase */
                _state = REPLAY_AND_COUNT;
                _bigContainer.addChild(_flashingText);
                _possScore--;
                _timer = 0;
                _previewLevelLine.alpha = 0.2;
                _playerRecordingLine.graphics.moveTo(_playerRecording[0].x(), _playerRecording[0].y());
                _bigContainer.addChild(_playerRecordingLine);
                _bigContainer.addChild(_replayCircle);
                _levelDriver.setCircle(_replayCircle);
                var tc = _makeCenteredTextContainer(["" + 0]);
                _scoreTxt = tc.text;
                _finalScoreContainer = tc.container;
                _bigContainer.addChild(_finalScoreContainer);
            }
        } /* replaying user input and counting score */
        else if (_state == REPLAY_AND_COUNT) {
            _scorePhase();
        } /* showing user the final score and grade */
        else if (_state == DISPLAY_SCORE) {
            // if (_timer == DISPLAY_SCORE_TIMER) {
                // moosetrack.gotoStartMenu();
            // }
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