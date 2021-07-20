const FPS = 60;
const START_SCALE = 1;
const ZOOM_SLIDER_WIDTH = 40;
// num millis for the ball to move one square
const BALL_MOVE_INTERVAL = 50;

const ARROW_BUTTON_VERT_HEIGHT = 100;
const ARROW_BUTTON_VERT_WIDTH = 25;
const ARROW_BUTTON_HORZ_HEIGHT = ARROW_BUTTON_VERT_WIDTH;
const ARROW_BUTTON_HORZ_WIDTH = ARROW_BUTTON_VERT_HEIGHT;

const MAX_ZOOM = 8;
const MIN_ZOOM = 0.01;
const BLOCK_SIZE = 16;

const BLOCK_TYPES = [
    "ball",
    "block",
];

const GAME_NUM_ROWS = 16;// * 7;
const GAME_NUM_COLS = 16;// * 7;
const NUM_BLOCKS = 5000;
//const NUM_BLOCKS = 5;

//const GAME_NUM_ROWS = 5;
//const GAME_NUM_COLS = 5;

const PIECES = [
    {
        typ: "ball",
        row: Math.floor(GAME_NUM_ROWS / 2),
        col: Math.floor(GAME_NUM_COLS / 2),
    },
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
        }

        for (let i = 0; i < this.pieces.length; i++) {
            const piece = this.pieces[i];
            this.addPiece(piece);
        }
    }

    addPiece(piece) {
        this.matrix[piece.row][piece.col] = piece;
        if (piece.typ == "ball") {
            this.ball = piece;
        }
    }

    moveBall(deltaRow, deltaCol) {
        const newRow = this.ball.row + deltaRow;
        const newCol = this.ball.col + deltaCol;

        if (newRow < 0 || newRow >= this.numRows || newCol < 0 || newCol >= this.numCols) {
            // TODO
            return null;
        }

        const arrivedAtPiece = this.matrix[newRow][newCol];
        if (arrivedAtPiece != null && arrivedAtPiece.typ == "block") {
            // TODO
            return null;
        }

        this.matrix[this.ball.row][this.ball.col] = null;
        this.ball.row = newRow;
        this.ball.col = newCol;
        this.matrix[this.ball.row][this.ball.col] = this.ball;
        this.momentum = {
            deltaRow: deltaRow,
            deltaCol: deltaCol,
        };

        return {
            deltaRow: deltaRow,
            deltaCol: deltaCol,
            newRow: newRow,
            newCol: newCol,
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
        const ballX = this.game.ball.bitmap.x;
        const ballY = this.game.ball.bitmap.y;
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
    }

    setup() {
        createjs.Ticker.framerate = FPS;

        this.queueResult = {};
        for (let i = 0; i < BLOCK_TYPES.length; i++) {
            const typ = BLOCK_TYPES[i];
            this.queueResult[typ] = this.queue.getResult(typ);
        }

        this.canvas = document.getElementsByTagName("canvas")[0];
        this.canvas.width = document.body.clientWidth;// - ZOOM_SLIDER_WIDTH;
        this.canvas.height = document.body.clientHeight; // -30 for slider space

        this.stage = new createjs.StageGL(this.canvasId);
        createjs.Touch.enable(this.stage);
        this.stage.updateViewport(this.canvas.width, this.canvas.height);
        this.stage.setClearColor("#000");

        this.container = new createjs.Container();
        this.container.x = 0;
        this.container.y = 0;

        this.stage.addChild(this.container);

        // Draw background color
        const g = new createjs.Shape();
        g.graphics.beginFill("#000").drawRect(0, 0, this.game.numCols * BLOCK_SIZE, this.game.numRows * BLOCK_SIZE);
        this.container.addChild(g);
        g.cache(0, 0, this.game.numCols * BLOCK_SIZE, this.game.numRows * BLOCK_SIZE);

        this.drawGrid();

        for (let i = 0; i < this.game.pieces.length; i++) {
            const piece = this.game.pieces[i];
            piece.bitmap = new createjs.Bitmap(this.queueResult[piece.typ]);
            piece.bitmap.x = piece.col * BLOCK_SIZE;
            piece.bitmap.y = piece.row * BLOCK_SIZE;
            this.container.addChild(piece.bitmap);
        }

        this.stage.update();

        createjs.Ticker.addEventListener("tick", handleTick);
        const THIS = this;
        function handleTick(event) {
            THIS.handleTick(event);
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
        line.graphics.setStrokeStyle(1).beginStroke("#00F");
        line.graphics.moveTo(0, rowIndex * BLOCK_SIZE);
        line.graphics.lineTo(this.game.numCols * BLOCK_SIZE, rowIndex * BLOCK_SIZE);
        line.graphics.endStroke();
    }

    drawVertGridLine(colIndex, line) {
        line.graphics.setStrokeStyle(1).beginStroke("#00F");
        line.graphics.moveTo(colIndex * BLOCK_SIZE, 0);
        line.graphics.lineTo(colIndex * BLOCK_SIZE, this.game.numRows * BLOCK_SIZE);
        line.graphics.endStroke();
    }

    handleTick(event) {
        if (this.camera.trackingBall) {
            this.camera.centerBall();
            this.camera.placeCamera();
            this.stage.update();
        }
    }

    drawBallMove(movement, controllerCallback) {
        this.movement = movement;

        const destX = movement.newCol * BLOCK_SIZE;
        const destY = movement.newRow * BLOCK_SIZE;

        createjs.Tween.get(this.game.ball.bitmap)
            .to({x: destX, y: destY}, BALL_MOVE_INTERVAL, createjs.Ease.linear)
            .call(controllerCallback);
    }
}

class Controller {
    constructor(game, viz) {
        this.game = game;
        this.viz = viz;
        this.enabledMovement = true;
        this.dragStart = null;
        this.setupArrowButtons();

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

        this.zoomSlider = document.getElementById("zoom-range");
        this.zoomSlider.style.width = 40;
        this.zoomSlider.style.height = this.viz.canvas.height - 40;
        this.zoomSlider.value = START_SCALE;
        //console.log(this.zoomSlider.style.height);


        //this.rangeInput = 
        this.zoomSlider.addEventListener("input", function(x) {
            THIS.zoomRangeInput(x)
        });



    }

    setupArrowButtons() {
        const OFFSET = 30;

        this.rightArrowButton = document.getElementById("right-arrow");
        this.rightArrowButton.style.height = ARROW_BUTTON_VERT_HEIGHT;
        this.rightArrowButton.style.width = ARROW_BUTTON_VERT_WIDTH;
        this.rightArrowButton.style.left = OFFSET;
        this.rightArrowButton.style.top = this.viz.canvas.height / 2 - ARROW_BUTTON_VERT_HEIGHT / 2;


        this.leftArrowButton = document.getElementById("left-arrow");
        this.leftArrowButton.style.height = ARROW_BUTTON_VERT_HEIGHT;
        this.leftArrowButton.style.width = ARROW_BUTTON_VERT_WIDTH;
        this.leftArrowButton.style.left = this.viz.canvas.width - ARROW_BUTTON_VERT_WIDTH;
        this.leftArrowButton.style.top = this.viz.canvas.height / 2 - ARROW_BUTTON_VERT_HEIGHT / 2;

        this.upArrowButton = document.getElementById("up-arrow");
        this.upArrowButton.style.height = ARROW_BUTTON_HORZ_HEIGHT;
        this.upArrowButton.style.width = ARROW_BUTTON_HORZ_WIDTH;
        this.upArrowButton.style.left = OFFSET/2 + this.viz.canvas.width / 2 - ARROW_BUTTON_HORZ_WIDTH / 2;
        this.upArrowButton.style.top = 0;//this.viz.canvas.height / 2 - ARROW_BUTTON_VERT_HEIGHT / 2;

        this.downArrowButton = document.getElementById("down-arrow");
        this.downArrowButton.style.height = ARROW_BUTTON_HORZ_HEIGHT;
        this.downArrowButton.style.width = ARROW_BUTTON_HORZ_WIDTH;
        this.downArrowButton.style.left = OFFSET / 2 + this.viz.canvas.width / 2 - ARROW_BUTTON_HORZ_WIDTH / 2;
        this.downArrowButton.style.top = this.viz.canvas.height- ARROW_BUTTON_VERT_HEIGHT / 2;


    }

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
        if (movement) {
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
        {id: "ball", src:"ball-16.png"},
        {id: "block", src:"block-16.png"},
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
