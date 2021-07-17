const FPS = 30;
const START_SCALE = 4;


const MAX_ZOOM = 8;
const MIN_ZOOM = 0.01;
const BLOCK_SIZE = 16;

const BLOCK_TYPES = [
    "ball",
    "block",
];

//const GAME_NUM_ROWS = 15 * 7;
//const GAME_NUM_COLS = 15 * 7;

const GAME_NUM_ROWS = 5;
const GAME_NUM_COLS = 5;

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

//const NUM_BLOCKS = 5000;
const NUM_BLOCKS = 5;
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
}

class Camera {
    constructor(viz, game, scale) {
        this.viz = viz;
        this.game = game;
        this.trackingBall = true;

        this.scale = scale;        
        this.viz.container.scaleX = this.scale;
        this.viz.container.scaleY = this.scale;

        // The coordinates for the center of the *container* (not the stage)
        this.center = {
            x: 0,
            y: 0,
        };
    }

    centerBall(ball) {
        const ballX = this.game.ball.bitmap.x;
        const ballY = this.game.ball.bitmap.y;
        this.center.x = (ballX + BLOCK_SIZE / 2) * this.scale;
        this.center.y = (ballY + BLOCK_SIZE / 2) * this.scale;
    }

    /*update(container) {
        container.scaleX = this.scale;
        container.scaleY = this.scale;
    }*/

    // The coordinates for the center of the *container* (not the stage)
    pan(center) {

        //this.update(container);

        if (this.trackingBall) {
            this.centerBall(this.game.ball);
        } else {
            this.center = center;
        }

        this.viz.container.x = this.viz.canvas.width / 2 - this.center.x;
        this.viz.container.y = this.viz.canvas.height / 2 - this.center.y;

        //console.log("hello", this.center);
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
        this.camera.pan();
    }

    setup() {
        createjs.Ticker.framerate = FPS;
        

        this.queueResult = {};
        for (let i = 0; i < BLOCK_TYPES.length; i++) {
            const typ = BLOCK_TYPES[i];
            this.queueResult[typ] = this.queue.getResult(typ);
        }

        this.canvas = document.getElementsByTagName("canvas")[0];
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;

        this.stage = new createjs.StageGL(this.canvasId);
        createjs.Touch.enable(this.stage);
        this.stage.updateViewport(this.canvas.width, this.canvas.height);
        this.stage.setClearColor("#000");

        this.container = new createjs.Container();
        this.container.x = 0;
        this.container.y = 0;

        
        this.stage.addChild(this.container);

        const g = new createjs.Shape();
        g.graphics.beginFill("red").drawRect(0, 0, this.game.numCols * BLOCK_SIZE, this.game.numRows * BLOCK_SIZE);
        this.container.addChild(g);
        g.cache(0, 0, this.game.numCols * BLOCK_SIZE, this.game.numRows * BLOCK_SIZE)



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
            this.camera.pan();
            this.stage.update();
        }
    }
}

class Controller {
    constructor(game, viz) {
        this.game = game;
        this.viz = viz;
        this.enabledMovement = true;

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


    }

    pressmove(evt) {
        console.log("pressmove");
    }

    pressup(evt) {
        console.log("pressup");
    }

    //https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
    zoom(event) {
        event.preventDefault();

        let scale = this.viz.camera.scale;
        scale += event.deltaY * -0.001;

        // Restrict scale
        scale = Math.min(Math.max(MIN_ZOOM, scale), MAX_ZOOM);

        this.viz.camera.scale = scale;
        this.viz.pan();
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
