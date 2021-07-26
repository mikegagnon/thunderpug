const FPS = 60;
const START_SCALE = 2;
const ZOOM_SLIDER_WIDTH = 40;
// num millis for the ball to move one square
const BALL_MOVE_INTERVAL = 50;

const ARROW_BUTTON_VERT_HEIGHT = 100;
const ARROW_BUTTON_VERT_WIDTH = 25;
const ARROW_BUTTON_HORZ_HEIGHT = ARROW_BUTTON_VERT_WIDTH;
const ARROW_BUTTON_HORZ_WIDTH = ARROW_BUTTON_VERT_HEIGHT;

const MAX_ZOOM = 8;
const MIN_ZOOM = 0.01;
const BLOCK_SIZE = 15;

const BLOCK_TYPES = [
    "spawn",
    "ball",
    "block",
    "trap",
    "token",
];




const GAME_NUM_ROWS = 16;// * 7;
const GAME_NUM_COLS = 16;// * 7;
const NUM_BLOCKS = 50//000;
//const NUM_BLOCKS = 5;

//const GAME_NUM_ROWS = 5;
//const GAME_NUM_COLS = 5;

/*PIECE_DRAW_ORDER = [
    "trap-floor",
    "block",
    "ball",
    "trap-ceil"
];*/

const PIECES = [
    {
        typ: "spawn",
        row: Math.floor(GAME_NUM_ROWS / 2),
        col: Math.floor(GAME_NUM_COLS / 2),
    },
    {
        typ: "ball",
        row: Math.floor(GAME_NUM_ROWS / 2),
        col: Math.floor(GAME_NUM_COLS / 2),
    },
    {
        typ: "trap",
        row: 0,
        col: 0,
    },
    {
        typ: "trap",
        row: 1,
        col: 0,
    },
    {
        typ: "trap",
        row: 2,
        col: 0,
    },
    {
        typ: "trap",
        row: 0,
        col: 1,
    },
    {
        typ: "trap",
        row: 0,
        col: 2,
    },
    {
        typ: "token",
        row: 2,
        col: 2,
    }
];

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

for (let i = 0; i < NUM_BLOCKS; i++) {
    const piece = {
        typ: "block",
        row: getRandomInt(0, GAME_NUM_ROWS),
        col: getRandomInt(0, GAME_NUM_COLS),
    };

    //if (piece.row)

    PIECES.push(piece);
}

class Game {
    constructor(numRows, numCols, pieces) {
        this.pieces = pieces;
        this.numRows = numRows;
        this.numCols = numCols;
        this.matrix = new Array(this.numRows);
        this.ball = null;
        this.momentum = {};

        for (let row = 0; row < this.numRows; row++) {
            this.matrix[row] = new Array(this.numRows);
            /*for (let col = 0; col < this.numCols; col++) {
                this.matrix[row][col] = undefined;
            }*/
        }

        for (let i = 0; i < this.pieces.length; i++) {
            const piece = this.pieces[i];
            this.addPiece(piece);
        }
    }

    forEachPiece(callback) {
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                const piece = this.matrix[row][col];
                //console.log(piece);
                if (piece) {
                    callback(piece);
                }
            }
        }

    }

    addPiece(piece) {
        if (piece.typ === "ball") {
            this.ball = piece;
            return;
        }
        //let cell = [];
        if (this.matrix[piece.row][piece.col] === undefined) {
            //cell = this.matrix[piece.row][piece.col];
            this.matrix[piece.row][piece.col] = piece;
        }
        //cell.push(piece);
        //this.matrix[piece.row][piece.col] = cell;

    }

    /*cellContainsTyp(cell, typ) {
        if (cell === undefined) {
            return false;
        }
        for (let i = 0; i < cell.length; i++) {
            const piece = cell[i];
            if (piece.typ === typ) {
                console.log(true);
                return true;
            }
        }
        return false;
    }

    cellContainsBlock(cell) {
        return this.cellContainsTyp(cell, "block");
    }

    cellContainsTrap(cell) {
        return this.cellContainsTyp(cell, "trap");
    }*/

    moveBall(deltaRow, deltaCol) {
        const beforePiece = this.matrix[this.ball.row][this.ball.col];

        if (beforePiece && beforePiece.typ === "trap") {
            return { trapped: beforePiece};
        }


        const newRow = this.ball.row + deltaRow;
        const newCol = this.ball.col + deltaCol;

        if (newRow < 0 || newRow >= this.numRows || newCol < 0 || newCol >= this.numCols) {
            // TODO
            return null;
        }

        //const arrivedAtCell = this.matrix[newRow][newCol];
        const arrivedAtPiece = this.matrix[newRow][newCol];
        //
        if (arrivedAtPiece != undefined && arrivedAtPiece.typ == "block") {
        //if (this.cellContainsBlock(arrivedAtCell)) {
            // TODO
            return null;
        }

        
        //const trapped = this.cellContainsTrap(arrivedAtCell);


        //this.matrix[this.ball.row][this.ball.col] = null;
        this.ball.row = newRow;
        this.ball.col = newCol;
        //this.matrix[this.ball.row][this.ball.col] = this.ball;
        this.momentum = {
            deltaRow: deltaRow,
            deltaCol: deltaCol,
        };

        return {
            deltaRow: deltaRow,
            deltaCol: deltaCol,
            newRow: newRow,
            newCol: newCol,
            //trapped: trapped,
        };
    }
}

class Camera {
    constructor(viz, game, scale) {
        this.viz = viz;
        this.game = game;
        this.trackingBall = true;
        

        // The coordinates for the center of the *container* (not the stage)
        this.center = {
            x: 0,
            y: 0,
        };

        this.centerBall();
        this.placeCamera();
        this.zoom(scale);
    }

    centerBall(ball) {
        const ballX = this.viz.ballAnimation.x;
        const ballY = this.viz.ballAnimation.y;
        this.center.x = (ballX + BLOCK_SIZE / 2) * this.scale;
        this.center.y = (ballY + BLOCK_SIZE / 2) * this.scale;
    }

    zoom(scale) {
        this.scale = scale;
        this.viz.container.scaleX = this.scale;
        this.viz.container.scaleY = this.scale;
        //console.log(this.scale);
    }

    /*update(container) {
        container.scaleX = this.scale;
        container.scaleY = this.scale;
    }*/

    // The coordinates for the center of the *container* (not the stage)
    /*pan(center) {

        //this.update(container);

        if (this.trackingBall) {
            this.centerBall(this.game.ball);
        } else {
            this.center = center;
        }

        this.viz.container.x = this.viz.canvas.width / 2 - this.center.x;
        this.viz.container.y = this.viz.canvas.height / 2 - this.center.y;

        //console.log("hello", this.center);
    }*/

    placeCamera() {
        //console.log("placeCamera")
        this.viz.container.x = this.viz.canvas.width / 2 - this.center.x;
        this.viz.container.y = this.viz.canvas.height / 2 - this.center.y;
    }
}

class Viz {
    constructor(queue, game, canvasId, scale, mode) {
        this.queue = queue;
        this.game = game;
        this.canvasId = canvasId;
        this.mode = mode;
        this.setup();
        this.camera = new Camera(this, this.game, scale);

        this.stage.update();
        createjs.Ticker.addEventListener("tick", handleTick);
        const THIS = this;
        function handleTick(event) {
            THIS.handleTick(event);
        }
    }

    setup() {
        createjs.Ticker.framerate = FPS;


        
        //this.queueResult = {};
        /*for (let i = 0; i < BLOCK_TYPES.length; i++) {
            const typ = BLOCK_TYPES[i];
            this.queueResult[typ] = this.queue.getResult(typ);
        }*/

        this.setupSprites();

        this.canvas = document.getElementsByTagName("canvas")[0];
        this.canvas.width = document.body.clientWidth;// - ZOOM_SLIDER_WIDTH;
        this.canvas.height = document.body.clientHeight; // -30 for slider space

        this.stage = new createjs.StageGL(this.canvasId);
        createjs.Touch.enable(this.stage);
        this.stage.updateViewport(this.canvas.width, this.canvas.height);
        this.stage.setClearColor("#111");

        this.container = new createjs.Container();
        this.container.x = 0;
        this.container.y = 0;

        this.stage.addChild(this.container);

        // Draw background color
        const g = new createjs.Shape();
        g.graphics.beginFill("#eee").drawRect(0, 0, this.game.numCols * BLOCK_SIZE, this.game.numRows * BLOCK_SIZE);
        this.container.addChild(g);
        g.cache(0, 0, this.game.numCols * BLOCK_SIZE, this.game.numRows * BLOCK_SIZE);

        this.drawGrid();



        /*var animation = new createjs.Sprite(trapSpriteSheet);

        animation.x = 0;
        animation.y = 0;
        this.container.addChild(animation);
        animation.gotoAndPlay("shut");*/

        const THIS = this;
        function drawSprite(piece, spriteName) {
            console.log(spriteName)
            const z = THIS.queueResult[spriteName];
            const animation = new createjs.Sprite(z.sheet);
            animation.x = piece.col * BLOCK_SIZE;
            animation.y = piece.row * BLOCK_SIZE;
            z.init(animation);
            THIS.container.addChild(animation);
            return animation;
        }

        this.game.forEachPiece(function(piece) {
            //console.log(1);
            if (piece.typ == "trap") {
                drawSprite(piece, "trap-floor");
            } else if (piece.typ == "block") {
                drawSprite(piece, "block");
            } else if (piece.typ == "spawn") {
                drawSprite(piece, "spawn");
            } else if (piece.typ == "token") {
                drawSprite(piece, "token")
            }
        });

        // Draw ball
        this.ballAnimation = null;
        const z = this.queueResult["ball"];
        this.ballAnimation = new createjs.Sprite(z.sheet);
        this.ballAnimation.x = this.game.ball.col * BLOCK_SIZE;
        this.ballAnimation.y = this.game.ball.row * BLOCK_SIZE;
        z.init(this.ballAnimation);
        this.container.addChild(this.ballAnimation);

        this.game.forEachPiece(function(piece) {
            //console.log(1);
            if (piece.typ == "trap") {
                piece.animation = drawSprite(piece, "trap-ceil");
            }
        });

        //for (let i = 0; i < this.game.pieces.length; i++) {
        for (let r = 0; r < this.game.matrix.length; r++) {
        for (let c = 0; c < this.game.matrix[r].length; c++) {
            /*const cell = this.game.matrix[r][c];
            if (!cell) {
                continue;
            }
            const piece = cell[0];*/
            //const piece = this.game.pieces[i];
            //piece.bitmap = new createjs.Bitmap(this.queueResult[piece.typ]);
            /*piece.bitmap.x = piece.col * BLOCK_SIZE;
            piece.bitmap.y = piece.row * BLOCK_SIZE;
            this.container.addChild(piece.bitmap);*/

            /*
            const animation = new createjs.Sprite(trapSpriteSheet);
            animation.x = piece.col * BLOCK_SIZE;
            animation.y = piece.row * BLOCK_SIZE;
            const frame = Math.floor(Math.random() * 8);
            animation.gotoAndPlay(frame);
            this.container.addChild(animation);*/

            /*
            const animation = new createjs.Sprite(blockSpriteSheet);
            animation.x = piece.col * BLOCK_SIZE;
            animation.y = piece.row * BLOCK_SIZE;
            const frame = Math.floor(Math.random() * 12);
            //animation.framerate = 1;
            animation.gotoAndPlay(frame);
            this.container.addChild(animation);*/
            



            /*
            const z = this.queueResult[piece.typ];
            const animation = new createjs.Sprite(z.sheet);
            animation.x = piece.col * BLOCK_SIZE;
            animation.y = piece.row * BLOCK_SIZE;
            z.init(animation);
            
            this.container.addChild(animation);


            */

            /*if (piece.typ == "ball") {
                this.ballAnimation = animation;
            }*/


        }}



    }

    setupSprites() {
        this.queueResult = {};

        const spawnSheetData = {
            images: [this.queue.getResult("spawn")],
            frames: {width:16, height:16},
            animations: {
                still:0,
            }
        };
        const spawnSpriteSheet = new createjs.SpriteSheet(spawnSheetData);
        //const trapAnimation = new createjs.Sprite(trapSpriteSheet);
        //this.queueResult["trap"] = trapAnimation;
        this.queueResult["spawn"] = {
            sheet: spawnSpriteSheet,
            init: function(animation) {
                //animation.gotoAndPlay("shut");
                animation.gotoAndStop(0);
            },
        };

        const tokenSheetData = {
            images: [this.queue.getResult("token")],
            frames: {width:16, height:16},
            animations: {
                color:[0,11,"color1"],
                color1:[0,11,"color2"],
                color2:[0,11,"color3"],
                color3:[0,11,"color4"],
                color4:[0,15,"color"],
            }
        };
        const tokenSpriteSheet = new createjs.SpriteSheet(tokenSheetData);
        //const trapAnimation = new createjs.Sprite(trapSpriteSheet);
        //this.queueResult["trap"] = trapAnimation;
        this.queueResult["token"] = {
            sheet: tokenSpriteSheet,
            init: function(animation) {
                //animation.gotoAndPlay("shut");
                animation.gotoAndPlay("color");
                animation.framerate = 20;
            },
        };

        const trapFloorSheetData = {
            images: [this.queue.getResult("trap-floor")],
            frames: {width:16, height:16},
            animations: {
                still:0,
                shut:[0,8,"shut"],
            }
        };
        const trapFloorSpriteSheet = new createjs.SpriteSheet(trapFloorSheetData);
        //const trapAnimation = new createjs.Sprite(trapSpriteSheet);
        //this.queueResult["trap"] = trapAnimation;
        this.queueResult["trap-floor"] = {
            sheet: trapFloorSpriteSheet,
            init: function(animation) {
                //animation.gotoAndPlay("shut");
                animation.gotoAndStop(0);
                //animation.framerate = 1;
            },
        };

        const trapCeilSheetData = {
            images: [this.queue.getResult("trap-ceil")],
            frames: {width:16, height:16},
            animations: {
                still:0,
                shut:[0,12,"still"],
            }
        };
        const trapCeilSpriteSheet = new createjs.SpriteSheet(trapCeilSheetData);
        trapCeilSpriteSheet.framerate = 20;

        //const trapAnimation = new createjs.Sprite(trapSpriteSheet);
        //this.queueResult["trap"] = trapAnimation;
        this.queueResult["trap-ceil"] = {
            sheet: trapCeilSpriteSheet,
            init: function(animation) {
                //animation.gotoAndPlay("shut");
                animation.gotoAndStop(0);
            },
        }

        var blockSheetData = {
            images: [this.queue.getResult("block")],
            frames: {width:16, height:16},
            animations: {
                color:[0,11,"color"],
            },
        };
        const blockSpriteSheet = new createjs.SpriteSheet(blockSheetData);
        blockSpriteSheet.framerate = 10;
        //const blockAnimation = new createjs.Sprite(blockSpriteSheet);
        this.queueResult["block"] = {
            sheet: blockSpriteSheet,
            init: function(animation) {
                //animation.gotoAndPlay("color");
                const frame = Math.floor(Math.random() * 12);
                //animation.framerate = 1;
                animation.gotoAndStop(frame);
            }
        }

        const ballSheetData = {
            images: [this.queue.getResult("ball")],
            frames: {width:16, height:16},
        };
        const ballSpriteSheet = new createjs.SpriteSheet(ballSheetData);


        this.queueResult["ball"] = {
            sheet: ballSpriteSheet,
            init: function(){}
        }
    }

    drawGrid() {
        const line = new createjs.Shape();

        for (let r = 0; r <= this.game.numRows; r++) {
            this.drawHorzGridLine(r, line);
        }
        for (let c = 0; c <= this.game.numCols; c++) {
            this.drawVertGridLine(c, line);
        }

        this.container.addChild(line);
        line.cache(0, 0, this.game.numCols * BLOCK_SIZE, this.game.numRows * BLOCK_SIZE)
    }

    drawHorzGridLine(rowIndex, line) {
        line.graphics.setStrokeStyle(0.5).beginStroke("#88f");
        line.graphics.moveTo(0, rowIndex * BLOCK_SIZE);
        line.graphics.lineTo(this.game.numCols * BLOCK_SIZE, rowIndex * BLOCK_SIZE);
        line.graphics.endStroke();
    }

    drawVertGridLine(colIndex, line) {
        line.graphics.setStrokeStyle(0.5).beginStroke("#88f");
        line.graphics.moveTo(colIndex * BLOCK_SIZE, 0);
        line.graphics.lineTo(colIndex * BLOCK_SIZE, this.game.numRows * BLOCK_SIZE);
        line.graphics.endStroke();
    }

    handleTick(event) {
        if (this.camera.trackingBall) {
            this.camera.centerBall();
            this.camera.placeCamera();
            this.stage.update(event);
        }
    }

    drawBallMove(movement, controllerCallback) {
        //this.movement = movement;

        const destX = movement.newCol * BLOCK_SIZE;
        const destY = movement.newRow * BLOCK_SIZE;

        createjs.Tween.get(this.ballAnimation)
            .to({x: destX, y: destY}, BALL_MOVE_INTERVAL, createjs.Ease.linear)
            .call(controllerCallback);
    }

    drawTrapShut(movement, controllerCallback) {
        console.log("1");
        movement.trapped.animation.on("animationend",controllerCallback);
        movement.trapped.animation.gotoAndPlay("shut");
    }
}

class Controller {
    constructor(game, viz) {
        this.game = game;
        this.viz = viz;
        this.enabledMovement = true;
        this.dragStart = null;
        //this.setupArrowButtons();

        // https://stackoverflow.com/questions/5597060/detecting-arrow-key-presses-in-javascript
        document.onkeydown = checkKey;
        const THIS = this;
        function checkKey(e) {

            e = e || window.event;

            if (e.keyCode == '38') {
                THIS.up();
            }
            else if (e.keyCode == '40') {
                THIS.down();
            }
            else if (e.keyCode == '37') {
                THIS.left();
            }
            else if (e.keyCode == '39') {
                THIS.right();
            }
        }

        this.viz.canvas.onwheel = function(event) {
            THIS.zoom(event);
        };

        this.viz.container.on("pressmove", function(evt) {
            THIS.pressmove(evt);
        });

        this.viz.container.on("pressup", function(evt) {
            THIS.pressup(evt);
        });


        /*
        createjs.Tween.get(this.viz.container, {override: true})
            .to({scaleX: 1.5, scaleY: 1.5, x: 100, y: 100}, 0, createjs.Ease.getPowIn(3.5))
            //.to()
            .addEventListener("change", handleChange);
        function handleChange(event) {
            // The tween changed.
            //console.log(event.target.target);
            //event.target.target.x = -1000;
        }*/
        /*
        this.zoomSlider = document.getElementById("zoom-range");
        this.zoomSlider.style.width = 40;
        this.zoomSlider.style.height = this.viz.canvas.height - 40;
        this.zoomSlider.value = START_SCALE;

        //console.log(this.zoomSlider.style.height);


        //this.rangeInput = 
        this.zoomSlider.addEventListener("input", function(x) {
            THIS.zoomRangeInput(x)
        });
        */



    }


    /*setupArrowButtons() {
        const OFFSET = 30;
        const THIS = this;
        this.leftArrowButton = document.getElementById("left-arrow");
        this.leftArrowButton.style.height = ARROW_BUTTON_VERT_HEIGHT;
        this.leftArrowButton.style.width = ARROW_BUTTON_VERT_WIDTH;
        this.leftArrowButton.style.left = OFFSET;
        this.leftArrowButton.style.top = this.viz.canvas.height / 2 - ARROW_BUTTON_VERT_HEIGHT / 2;
        this.leftArrowButton.onclick = function() {
            THIS.left();
        }

        this.rightArrowButton = document.getElementById("right-arrow");
        this.rightArrowButton.style.height = ARROW_BUTTON_VERT_HEIGHT;
        this.rightArrowButton.style.width = ARROW_BUTTON_VERT_WIDTH;
        this.rightArrowButton.style.left = this.viz.canvas.width - ARROW_BUTTON_VERT_WIDTH;
        this.rightArrowButton.style.top = this.viz.canvas.height / 2 - ARROW_BUTTON_VERT_HEIGHT / 2;
        this.rightArrowButton.onclick = function() {
            THIS.right();
        }

        this.upArrowButton = document.getElementById("up-arrow");
        this.upArrowButton.style.height = ARROW_BUTTON_HORZ_HEIGHT;
        this.upArrowButton.style.width = ARROW_BUTTON_HORZ_WIDTH;
        this.upArrowButton.style.left = OFFSET/2 + this.viz.canvas.width / 2 - ARROW_BUTTON_HORZ_WIDTH / 2;
        this.upArrowButton.style.top = 0;
        this.upArrowButton.onclick = function() {
            THIS.up();
        }

        this.downArrowButton = document.getElementById("down-arrow");
        this.downArrowButton.style.height = ARROW_BUTTON_HORZ_HEIGHT;
        this.downArrowButton.style.width = ARROW_BUTTON_HORZ_WIDTH;
        this.downArrowButton.style.left = OFFSET / 2 + this.viz.canvas.width / 2 - ARROW_BUTTON_HORZ_WIDTH / 2;
        this.downArrowButton.style.top = this.viz.canvas.height- ARROW_BUTTON_VERT_HEIGHT / 2;
        this.downArrowButton.onclick = function() {
            THIS.down();
        }


    }*/

    zoomRangeInput(x) {

        // Restrict scale
        let scale = x.target.value;
        scale = Math.min(Math.max(MIN_ZOOM, scale), MAX_ZOOM);

        //this.viz.pan();
        this.viz.camera.placeCamera();
        this.viz.camera.zoom(scale);
        //this.viz.stage.update();
    }

    stageMouseDown(evt) {
        //console.log("evt.pointerID", evt.pointerID);
    }

    pressmove(evt) {
        //console.log("pressmove");

        if (!this.dragStart) {
            this.viz.camera.trackingBall = false;
            this.dragStart = {
                x: evt.stageX - this.viz.container.x,
                y: evt.stageY - this.viz.container.y,
            };
            this.containerStart = this.dragStart;
            this.cameraCenterStart = {
                x: this.viz.camera.center.x,
                y: this.viz.camera.center.y,
            };
            //console.log(this.dragStart);
        } else {
            this.containerStart = {
                x: evt.stageX - this.viz.container.x + this.containerStart.x - this.dragStart.x,
                y: evt.stageY - this.viz.container.y + this.containerStart.y - this.dragStart.y,
            }
        }

        const newCameraCenter = {
            x: this.dragStart.x - this.containerStart.x + this.cameraCenterStart.x,
            y: this.dragStart.y - this.containerStart.y + this.cameraCenterStart.y,
        };

        this.viz.camera.center = newCameraCenter;
        //console.log(this.viz.camera.center);

        this.viz.camera.placeCamera();
        this.viz.stage.update();

    }

    pressup(evt) {
        //console.log("pressup");
        this.dragStart = null;
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
    zoom(event) {
        event.preventDefault();

        let scale = this.viz.camera.scale;
        scale += event.deltaY * 0.001;

        // Restrict scale
        scale = Math.min(Math.max(MIN_ZOOM, scale), MAX_ZOOM);

        //this.viz.pan();
        this.viz.camera.placeCamera();
        this.viz.camera.zoom(scale);
        //this.viz.stage.update();

    }

    disableMove() {
        this.enabledMovement = false;
    }

    enableMove() {
        this.enabledMovement = true;
    }

    up() {
        if (!this.enabledMovement) {
            return;
        }
        this.go(-1, 0);
    }
    
    down() {
        if (!this.enabledMovement) {
            return;
        }
        this.go(1, 0);
    }
    
    left() {
        if (!this.enabledMovement) {
            return;
        }
        this.go(0, -1);
    }
    
    right() {
        if (!this.enabledMovement) {
            return;
        }
        this.go(0, 1);
    }

    go(deltaRow, deltaCol) {
        //console.log(1);
        this.disableMove();

        const movement = this.game.moveBall(deltaRow, deltaCol);
        if (movement && movement.trapped) {
            const THIS = this;
            this.viz.drawTrapShut(movement, function(){
                console.log(2);
                THIS.game.respawn();
                THIS.viz.respawn();
            });
        } else if (movement) {
            const THIS = this;
            this.viz.drawBallMove(movement, function(){
                THIS.go(deltaRow, deltaCol);
            });
        } else {
            this.enableMove();
        }
    }
}

let GAME;
let VIZ;
let CONTROLLER;



function initRbWorld() {
    const queue = new createjs.LoadQueue();
    queue.on("complete", handleComplete, this);
    queue.loadManifest([
        {id: "spawn", src:"spawn.png"},
        {id: "ball", src:"ball-16.png"},
        {id: "block", src:"block-sprite.png"},
        {id: "trap-floor", src:"trap-floor.png"},
        {id: "trap-ceil", src:"trap-ceil.png"},
        {id: "token", src:"token-sprite.png"},

    ]);
    function handleComplete() {
        if (MODE == "play") {
            GAME = new Game(GAME_NUM_ROWS, GAME_NUM_COLS, PIECES);
            VIZ = new Viz(queue, GAME, "rb-world-canvas", START_SCALE, MODE);
            CONTROLLER = new Controller(GAME, VIZ);
        } else {
            GAME = new Game(GAME_NUM_ROWS, GAME_NUM_COLS, PIECES);
            VIZ = new Viz(queue, GAME, "rb-world-canvas", START_SCALE, MODE);
            CONTROLLER = new Controller(GAME, VIZ);
        }
    }
}
