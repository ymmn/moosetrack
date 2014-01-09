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
    var _levelSelectMenu;
    var _levelBtns;
    var _levelLabel;
    var _difficultyLabel;
    var _goBtn;
    var _selectedLevel = 1;
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
        _selectedLevel = this.lvl;
        _levelLabel.text = "Level " + _selectedLevel;
    };

    var _goBtnOnclick = function () {
        moosetrack.startLevel(_selectedLevel);
    };

    var _difficultyBtnOnclick = function() {
        current_difficulty = this.diffInd;
        _difficultyLabel.text = DIFFICULTIES[current_difficulty];
        // that.refresh();
    };


    ///////////////  PRIVATE METHODS ////////////////
    var _init = function() {
        _bigContainer = new createjs.Container();

        _createInitialMenu();
    };

    var _createInitialMenu = function() {
        _bigContainer.removeAllChildren();
        _initialMenu = new createjs.Container();


        /* background */
        var bgd = new createjs.Bitmap("assets/startmenu.jpg");
        _initialMenu.addChild(bgd);
        // var overlay = new createjs.Bitmap("assets/overlay.png");
        // _initialMenu.addChild(overlay);

        /* logo */
        var bitmap = new createjs.Bitmap("assets/logo.jpg");
        bitmap.y -= 200;
        bitmap.x += 80;
        // bitmap.image.onload = function(){
            // bitmap.scaleX = (CANVAS_WIDTH / bitmap.image.width);
            // bitmap.scaleY = (CANVAS_HEIGHT / bitmap.image.height);
        // }
        // console.log(bitmap.image.width);
        //console.log(bitmap.image.width);

        // _initialMenu.addChild(bitmap);

        /* title */
        // var title = new createjs.Text('MooseTrack', '35px Helvetica', '#333');
        // title.textAlign = "center";
        // title.x = CANVAS_WIDTH / 2;
        // title.y = CANVAS_HEIGHT / 10;

        /* start button and its listeners */
        _startButton = new CenteredButton("", 730, 445, ENABLED_BTN_COLOR, 105, "black");
        _startButton.onclick = _startBtnOnclick;
        _initialMenu.addChild(_startButton.shape);
        _bigContainer.addChild(_initialMenu);

        /* Achievements button and its listeners */
        _achievementButton = new CenteredButton("", 222, 450, ENABLED_BTN_COLOR, 85, "black");
        _achievementButton.onclick = _achievementBtnOnclick;
        _initialMenu.addChild(_achievementButton.shape);
        _bigContainer.addChild(_initialMenu);
    };

    var _createLevelSelectMenu = function() {
        // _bigContainer.removeAllChildren();


        if (_levelSelectMenu === undefined ) {
            _levelSelectMenu = new createjs.Container();

            var bgd = new createjs.Bitmap("assets/levelselect.jpg");
            _levelSelectMenu.addChild(bgd);
        }

        /* title */
        // var title = new createjs.Text('Select Level', '35px Helvetica', '#333');
        // title.textAlign = "center";
        // title.x = CANVAS_WIDTH / 2;
        // title.y = CANVAS_HEIGHT / 10;

        // _levelSelectMenu.addChild(title);

        /* make a button for each level */
        _levelBtns = [];
        _levelBtnsContainer = new createjs.Container();
        var lvlBtnsGap = 37;
        for(var i = 0; i < 9; i++) {
        //     var color = DISABLED_BTN_COLOR;
            var lvl = i + 1;
        //     if( unlocked_levels[current_difficulty][lvl] ) {
        //         color = ENABLED_BTN_COLOR;
        //     }
        //     var y = 150 + lvlBtnsGap*i;
            var btn = new CenteredButton("", 604 + lvlBtnsGap * i, 248, color, 8, "black");
            btn.lvl = lvl;
            btn.onclick = _lvlBtnOnclick;
            _levelBtns.push(btn);
            _levelBtnsContainer.addChild(btn.shape);

        //     /* Display the top score for this level */
        //     var ts_percent = top_scores[current_difficulty][lvl];
        //     if( ts_percent !== undefined ) {
        //         var topscore = new createjs.Text(
        //             ts_percent + "% " + moosetrack.getGradeFromPercentage(ts_percent),
        //             '25px Helvetica', '#333'
        //         );
        //         topscore.textAlign = "center";
        //         topscore.x = CANVAS_WIDTH / 2 + 100;
        //         topscore.y = y - 13;
        //         /* color code the score */
        //         topscore.color = moosetrack.getScoreColor(ts_percent);
        //         _levelBtnsContainer.addChild(topscore);
        //     }
        }
        // _levelBtnsContainer.x = 0;
        // _levelBtnsContainer.y = 0;
        _levelSelectMenu.addChild(_levelBtnsContainer);

        // /* make a button for each difficulty */
        _difficultyBtns = [];
        var diffBtnLocs = [
            {
                x: 188,
                y: 210,
                rad: 10
            },
            {
                x: 256,
                y: 300,
                rad: 20
            },
            {
                x: 359,
                y: 388,
                rad: 30
            },
            {
                x: 514,
                y: 465,
                rad: 40
            }
        ];
        _difficultyBtnsContainer = new createjs.Container();
        // var diffBtnsGap = 180;
        var l = DIFFICULTIES.length;
        for(var i = 0; i < l; i++) {
            /* color button based on whether or not it's active */
            var color = ENABLED_BTN_COLOR;
            if( i === current_difficulty ) {
                color = SELECTED_BTN_COLOR;
            }
        //     var btnX = 200 + diffBtnsGap*i;
        //     var btnY = 500;
            console.log(diffBtnLocs[l - i - 1].x);
            var btn = new CenteredButton("",
                diffBtnLocs[l - i - 1].x, diffBtnLocs[l - i - 1].y, color, diffBtnLocs[l - i - 1].rad, "black");
            btn.diffInd = i;
            btn.onclick = _difficultyBtnOnclick;
            _difficultyBtns.push(btn);
            _difficultyBtnsContainer.addChild(btn.shape);
            // _bigContainer.addChild(btn.shape);

        //     /* draw the circle size of that difficulty */
        //     var circleY = btnY - btn.height()/2 - CIRCLE_RAD[i] - 8;
        //     var circ = new createjs.Shape();
        //     circ.graphics.beginFill(CIRCLE_COLOR).drawCircle(btnX, circleY, CIRCLE_RAD[i]);
        //     _difficultyBtnsContainer.addChild(circ);
        }
        _levelSelectMenu.addChild(_difficultyBtnsContainer);

        /* GO button */
        _goBtn = new CenteredButton("", 777, 489, "#F00", 70, "black");
        _goBtn.onclick = _goBtnOnclick;
        _levelSelectMenu.addChild(_goBtn.shape);

        /* selected level label */
        _levelLabel = new createjs.Text("Level " + _selectedLevel, "28px silom", "#333");
        _levelLabel.x = 596;
        _levelLabel.y = 170;
        _levelSelectMenu.addChild(_levelLabel);

        /* selected difficulty label */
        _difficultyLabel = new createjs.Text(DIFFICULTIES[current_difficulty], "28px silom", "#333");
        _difficultyLabel.x = 175;
        _difficultyLabel.y = 517;
        _levelSelectMenu.addChild(_difficultyLabel);


        _bigContainer.addChild(_levelSelectMenu);
    };

    var CenteredButton = function(text, x, y, color, radius, highlightColor) {
        /* states */
        var OUT = -1000;
        var HOVER = -1001;
        var CLICKING = -1002;
        /* fonts */
        var NORMAL_FONT = '28px silom';
        var HOVERED_FONT = '48px silom';


        var state = OUT;

        /* text */
        var that = this;
        var title = new createjs.Text(text, NORMAL_FONT, '#333');
        title.x = x;
        title.y = y - (title.getMeasuredHeight() / 2);
        title.textAlign = "center";

        /* highlight */
        var highlightCircle = new createjs.Shape();


        var button = new createjs.Container();
        button.addChild(title, highlightCircle);
        this.shape = button;

        var isHovered = function () {
            var mx = mousex;
            var my = mousey;
            var dx = Math.abs(mx - x);
            var dy = Math.abs(my - y);
            return Math.sqrt( dx*dx + dy*dy ) <= radius;
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

        this.tick = function () {
            /* highlight button if it's being hovered */
            if(isHovered()) {
                // console.log("HI");
                // highlightCircle.graphics.setStrokeStyle(2)
                //     .beginStroke(highlightColor)
                //     // .beginRadialGradientStroke(["#F00","#00F"], [0, 1], x, y, radius-2, x, y, radius)
                //     .drawCircle(x, y, radius);
            } else {
               // title.font = NORMAL_FONT;
               highlightCircle.graphics.clear();
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
            _goBtn.tick();
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