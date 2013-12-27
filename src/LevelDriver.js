function LevelDriver() {

    ////////////////  PRIVATE VARIABLES ///////////////
    var _circle;

    //////////////// PUBLIC METHODS //////////////
    this.setCircle = function (c) {
        _circle = c;
    };

    this.done = function () {
        if (_circle.x === 200) {
            return true;
        }
    };

    this.play = function () {
        _circle.x += 1;
    };

}