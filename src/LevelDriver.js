function LevelDriver(lvl) {

    ////////////////  PRIVATE VARIABLES ///////////////
    var _circle;
    var _myLvl = LEVELS[lvl];

    //////////////// PUBLIC METHODS //////////////
    this.setCircle = function (c) {
        _circle = c;
    };

    this.done = function () {
        return _myLvl.done(_circle);
    };

    this.play = function () {
        _myLvl.play(_circle);
    };

}