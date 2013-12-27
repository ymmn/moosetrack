function StartMenu() {

    ////////////////  CONSTANTS  ///////////////
    /* states */
    var INITIAL = -100;
    var SELECT_LEVEL = -101;
    var ENABLED_BTN_COLOR = "#999";
    var SELECTED_BTN_COLOR = "#555";
    var DISABLED_BTN_COLOR = "#CCC";


    ////////////////  PRIVATE VARIABLES ///////////////
    var _bigContainer;
    var _startButton;
    var _initialMenu;
    var _levelBtnsContainer;
    var _difficultyBtnsContainer;
    var _levelBtns;
    var _difficultyBtns;
    var _state = INITIAL;
    var that = this;


    ///////////////  BTN CLICK HANDLERS ////////////////
    var _startBtnOnclick = function(){
        _state = SELECT_LEVEL;
        _bigContainer.removeChild(_initialMenu);
        _createLevelSelectMenu();
    };

    var _lvlBtnOnclick = function() {
        console.log('hi');
        if( unlocked_levels[current_difficulty][this.lvl] ){
            startLevel(this.lvl);
        }
    };

    var _difficultyBtnOnclick = function() {
        current_difficulty = this.diffInd;
        that.refresh();
    };


    ///////////////  PRIVATE METHODS ////////////////
    var _init = function() {
        _bigContainer = new createjs.Container();

        _createInitialMenu();
    };

    var _createInitialMenu = function() {
        _bigContainer.removeAllChildren();
        _initialMenu = new createjs.Container();

        /* title */
        var title = new createjs.Text('MooseTrack', '35px Helvetica', '#333');
        title.textAlign = "center";
        title.x = CANVAS_WIDTH / 2;
        title.y = CANVAS_HEIGHT / 10;

        /* start button and its listeners */
        _startButton = new CenteredButton("Start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, ENABLED_BTN_COLOR);
        _startButton.onclick = _startBtnOnclick;
        _initialMenu.addChild(title, _startButton.shape);
        _bigContainer.addChild(_initialMenu);
    };

    var _createLevelSelectMenu = function() {
        _bigContainer.removeAllChildren();
        _levelSelectMenu = new createjs.Container();

        /* title */
        var title = new createjs.Text('Select Level', '35px Helvetica', '#333');
        title.textAlign = "center";
        title.x = CANVAS_WIDTH / 2;
        title.y = CANVAS_HEIGHT / 10;

        _levelSelectMenu.addChild(title);

        /* make a button for each level */
        _levelBtns = [];
        _levelBtnsContainer = new createjs.Container();
        var lvlBtnsGap = 100;
        for(var i = 0; i < Object.keys(LEVELS).length; i++) {
            var color = DISABLED_BTN_COLOR;
            var lvl = i + 1;
            if( unlocked_levels[current_difficulty][lvl] ) {
                color = ENABLED_BTN_COLOR;
            }
            var btn = new CenteredButton("Level " + lvl, CANVAS_WIDTH / 2, 150 + lvlBtnsGap*i, color);
            btn.lvl = lvl;
            btn.onclick = _lvlBtnOnclick;
            _levelBtns.push(btn);
            _levelBtnsContainer.addChild(btn.shape);
        }
        _levelBtnsContainer.x = 0;
        _levelBtnsContainer.y = 0;
        _levelSelectMenu.addChild(_levelBtnsContainer);

        /* make a button for each difficulty */
        _difficultyBtns = [];
        _difficultyBtnsContainer = new createjs.Container();
        var diffBtnsGap = 180;
        for(var i = 0; i < DIFFICULTIES.length; i++) {
            var color = ENABLED_BTN_COLOR;
            if( i === current_difficulty ) {
                color = SELECTED_BTN_COLOR;
            }
            var btn = new CenteredButton(DIFFICULTIES[i], 200 + diffBtnsGap*i, 500, color);
            btn.diffInd = i;
            btn.onclick = _difficultyBtnOnclick;
            _difficultyBtns.push(btn);
            _difficultyBtnsContainer.addChild(btn.shape);
        }
        _difficultyBtnsContainer.x = 0;
        _difficultyBtnsContainer.y = 0;
        _levelSelectMenu.addChild(_difficultyBtnsContainer);

        _bigContainer.addChild(_levelSelectMenu);
    };

    var CenteredButton = function(text, x, y, color) {
        /* states */
        var OUT = -1000;
        var HOVER = -1001;
        var CLICKING = -1002;

        var state = OUT;
        var boxW = 150;
        var boxH = 40;

        var title = new createjs.Text(text, '24px Helvetica', '#333');
        title.x = x - title.getMeasuredWidth() / 2;
        title.y = y - title.getMeasuredHeight() / 2;

        var box = new createjs.Shape(new createjs.Graphics().beginFill(color).drawRect(x - boxW / 2, y - boxH / 2, boxW, boxH));

        var button = new createjs.Container();
        button.addChild(box, title);
        this.shape = button;

        this.isClicked = function () {
            var mx = mousex;
            var my = mousey;

            var in_btn = (mx >= x - boxW / 2 && mx <= x + boxW / 2 && my >= y - boxH / 2 && my <= y + boxH / 2);

            /* proper click is hovering over button, clicking down mouse, and lifting up mouse */
            if( !in_btn ) {
                state = OUT;
                return false;
            } else {
                /* mouse within button */
                if ( state === OUT ) {
                    if ( !mouseDown ) {
                        state = HOVER;
                    }
                } else if ( state === HOVER ) {
                    if( mouseDown ) {
                        state = CLICKING;
                    }
                } else if ( state === CLICKING ) {
                    if( !mouseDown ) {
                        state = HOVER;
                        return true;
                    }
                }
            }

            return false;
        };

        this.tick = function () {
           if (this.isClicked()) {
                this.onclick();
            }
        };

    };




    //////////////// PUBLIC METHODS //////////////
    this.tick = function () {
        if( _state === INITIAL ) {
            _startButton.tick();
        } else if(_state === SELECT_LEVEL) {
            for(var i = 0; i < _levelBtns.length; i++) {
                _levelBtns[i].tick();
            }
            for(var i = 0; i < _difficultyBtns.length; i++) {
                _difficultyBtns[i].tick();
            }
        }
    };

    this.refresh = function() {
        console.log("REFRESH");
        if( _state === SELECT_LEVEL ) {
            _createLevelSelectMenu();
        }
    };

    this.getContainer = function() {
        return _bigContainer;
    };


    _init();

}