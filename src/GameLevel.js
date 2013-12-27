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


    ////////////////  PRIVATE VARIABLES ///////////////
    var _levelNameContainer;
    var _gameplayContainer;
    var _finalScoreContainer;
    var _bigContainer;
    var _state;
    var _levelDriver;
    var _levelNumber;


    ///////////////  PRIVATE METHODS ////////////////
    var _init = function () {
        _state = LEVEL_NAME;
        _levelDriver = new LevelDriver(_gameplayContainer);

        _levelNameContainer = _makeCenteredTextContainer("Level " + _levelNumber);
        _bigContainer.addChild(_levelNameContainer);
    };

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


    var _makeScoreDisplay = function (finalScore, possScore, percentage) {
        var content = "Final Score: " + finalScore + " / " + possScore + "\n";
        content += "" + percentage + "\n";
        _finalScoreContainer = _makeCenteredTextContainer(content);
        _bigContainer.addChild(_finalScoreContainer);
    };


    //////////////// PUBLIC METHODS //////////////
    this.tick = function () {
        if (_state == LEVEL_NAME) {

        } else if (_state == COUNTING_DOWN) {

        } else if (_state == PLAYING) {
            if (!_levelDriver.done()) {
                _levelDriver.play();
            } else {
                var finalScore = _levelDriver.score;
                var possScore = _levelDriver.possibleScore;
                // round to one decimal
                var percentage = Math.round((finalScore / possScore) * 1000) / 10;
                _makeScoreDisplay(finalScore, possScore, percentage);
            }
        } else if (_state == DISPLAY_SCORE) {

        }
    };

    this.getContainer = function () {
        return _bigContainer;
    };

    _init();

}