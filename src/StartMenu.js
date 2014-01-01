function StartMenu() {

    ////////////////  CONSTANTS  ///////////////
    /* states */
    var INITIAL = -100;
    var SELECT_LEVEL = -101;
    var ENABLED_BTN_COLOR = "#999";
    var HOVER_BTN_COLOR = "#BBB";
    var SELECTED_BTN_COLOR = "#555";
    var DISABLED_BTN_COLOR = "#CCC";


    ////////////////  PRIVATE VARIABLES ///////////////
    var _bigContainer;
    var _startButton;
    var _achievementButton;
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

    var _achievementBtnOnclick = function() {
        Clay.Achievement.showAll();
    };

    var _lvlBtnOnclick = function() {
        if( unlocked_levels[current_difficulty][this.lvl] ){
            moosetrack.startLevel(this.lvl);
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

        /* logo */
        var bitmap = new createjs.Bitmap("assets/logo.png");
        bitmap.y -= 200;
        bitmap.x += 80;
        // bitmap.image.onload = function(){
            // bitmap.scaleX = (CANVAS_WIDTH / bitmap.image.width);
            // bitmap.scaleY = (CANVAS_HEIGHT / bitmap.image.height);
        // }
        // console.log(bitmap.image.width);
        //console.log(bitmap.image.width);

        _initialMenu.addChild(bitmap);

        /* title */
        // var title = new createjs.Text('MooseTrack', '35px Helvetica', '#333');
        // title.textAlign = "center";
        // title.x = CANVAS_WIDTH / 2;
        // title.y = CANVAS_HEIGHT / 10;

        /* start button and its listeners */
        _startButton = new CenteredButton("Start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, ENABLED_BTN_COLOR);
        _startButton.onclick = _startBtnOnclick;
        _initialMenu.addChild(_startButton.shape);
        _bigContainer.addChild(_initialMenu);

        /* Achievements button and its listeners */
        _achievementButton = new CenteredButton("Achievements", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 200, ENABLED_BTN_COLOR);
        _achievementButton.onclick = _achievementBtnOnclick;
        _initialMenu.addChild(_achievementButton.shape);
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
            var y = 150 + lvlBtnsGap*i;
            var btn = new CenteredButton("Level " + lvl, CANVAS_WIDTH / 2 - 100, y, color);
            btn.lvl = lvl;
            btn.onclick = _lvlBtnOnclick;
            _levelBtns.push(btn);
            _levelBtnsContainer.addChild(btn.shape);

            /* Display the top score for this level */
            var ts_percent = top_scores[current_difficulty][lvl];
            if( ts_percent !== undefined ) {
                var topscore = new createjs.Text(
                    ts_percent + "% " + moosetrack.getGradeFromPercentage(ts_percent),
                    '25px Helvetica', '#333'
                );
                topscore.textAlign = "center";
                topscore.x = CANVAS_WIDTH / 2 + 100;
                topscore.y = y - 13;
                /* color code the score */
                topscore.color = moosetrack.getScoreColor(ts_percent);
                _levelBtnsContainer.addChild(topscore);
            }
        }
        _levelBtnsContainer.x = 0;
        _levelBtnsContainer.y = 0;
        _levelSelectMenu.addChild(_levelBtnsContainer);

        /* make a button for each difficulty */
        _difficultyBtns = [];
        _difficultyBtnsContainer = new createjs.Container();
        var diffBtnsGap = 180;
        for(var i = 0; i < DIFFICULTIES.length; i++) {
            /* color button based on whether or not it's active */
            var color = ENABLED_BTN_COLOR;
            if( i === current_difficulty ) {
                color = SELECTED_BTN_COLOR;
            }
            var btnX = 200 + diffBtnsGap*i;
            var btnY = 500;
            var btn = new CenteredButton(DIFFICULTIES[i], btnX, btnY, color);
            btn.diffInd = i;
            btn.onclick = _difficultyBtnOnclick;
            _difficultyBtns.push(btn);
            _difficultyBtnsContainer.addChild(btn.shape);

            /* draw the circle size of that difficulty */
            var circleY = btnY - btn.height()/2 - CIRCLE_RAD[i] - 8;
            var circ = new createjs.Shape();
            circ.graphics.beginFill(CIRCLE_COLOR).drawCircle(btnX, circleY, CIRCLE_RAD[i]);
            _difficultyBtnsContainer.addChild(circ);
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
        /* fonts */
        var NORMAL_FONT = '28px Helvetica';
        var HOVERED_FONT = '48px Helvetica';

        var state = OUT;
        var boxW = 160;
        var boxH = 40;
        var boxY = y - boxH / 2 + 15;
        var boxX = x - boxW / 2;

        var that = this;
        var title = new createjs.Text(text, NORMAL_FONT, '#333');
        title.x = x;
        title.y = y;
        title.textAlign = "center";


        var box = new createjs.Shape(new createjs.Graphics().beginFill(color).drawRect(boxX, boxY, boxW, boxH));
        box.alpha = 0.2;

        var button = new createjs.Container();
        button.addChild(box, title);
        this.shape = button;

        var isHovered = function () {
            var mx = mousex;
            var my = mousey;
            var loX = boxX;
            var hiX = boxX + boxW;
            var loY = boxY;
            var hiY = boxY + boxH;
            return (mx >= loX && mx <= hiX && my >= loY && my <= hiY);
        };

        this.isClicked = function () {
            var in_btn = isHovered();

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

        this.height = function () {
            return boxH;
        }

        this.width = function () {
            return boxW;
        }

        this.tick = function () {
            /* highlight button if it's being hovered */
            if(isHovered()) {
                if(color !== DISABLED_BTN_COLOR) {
                   box.graphics.beginFill(HOVER_BTN_COLOR).drawRect(boxX, boxY, boxW, boxH);
                   // title.font = HOVERED_FONT;
                }
            } else { 
               // title.font = NORMAL_FONT;
               box.graphics.beginFill(color).drawRect(boxX, boxY, boxW, boxH);
            }
            if (this.isClicked()) {
                this.onclick();
            }
        };

    };




    //////////////// PUBLIC METHODS //////////////
    this.tick = function () {
        if( _state === INITIAL ) {
            _startButton.tick();
            _achievementButton.tick();
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