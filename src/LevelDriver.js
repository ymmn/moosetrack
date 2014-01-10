function LevelDriver(lvl) {

    ////////////////  PRIVATE VARIABLES ///////////////
    var _circle;
    var _myLvl = LEVELS[lvl];

    //////////////// PUBLIC METHODS //////////////
    this.setCircle = function (c) {
        _circle = c;
        _myLvl.initialize(_circle);
    };

    this.done = function () {
        return _myLvl.done(_circle);
    };

    this.play = function () {
        _myLvl.play(_circle);
    };

    this.noPreview = function() {
        return _myLvl.no_preview;
    };

}