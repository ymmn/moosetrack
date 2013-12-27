function GameLevel() {

    ///////////////// CONSTANTS ////////////////
    /* states */
    var LEVEL_NAME = -1;
    var COUNTING_DOWN = -2;
    var PLAYING = -3;
    var DISPLAY_SCORE = -4;



    ////////////////  PRIVATE VARIABLES ///////////////
    var _levelNameContainer;
    var _state;


    ///////////////  PRIVATE METHODS ////////////////
    var _init = function () {

    };


    //////////////// PUBLIC METHODS //////////////
    this.tick = function () {
        if (_state == LEVEL_NAME) {

        } else if (_state == COUNTING_DOWN) {

        } else if (_state == PLAYING) {

        } else if (_state == DISPLAY_SCORE) {

        }
    };

    _init();

}