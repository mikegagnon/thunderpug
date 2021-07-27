const FPS = 60;
const START_SCALE = 2;
const ZOOM_SLIDER_WIDTH = 40;
// num millis for the ball to move one square
const BALL_MOVE_INTERVAL = 50;
const STAGE_TWEEN_TICKS = 30;

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



const WORLD_START_ROW = 0;
const WORLD_START_COL = 0;
const WORLD_ROWS = 7;
const WORLD_COLS = 7;
const GAME_NUM_ROWS = 16;// * 7;
const GAME_NUM_COLS = 16;// * 7;
const NUM_BLOCKS = 5//000;
//const NUM_BLOCKS = 5;

//const GAME_NUM_ROWS = 5;
//const GAME_NUM_COLS = 5;

/*PIECE_DRAW_ORDER = [
    "trap-floor",
    "block",
    "ball",
    "trap-ceil"
];*/

//const WORLD = [];

/*const PIECES = [
    {
        typ: "spawn",
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
];*/

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}



class LevelGenerator {

    constructor(world, numWorldRows, numWorldCols, worldRow, worldCol, stageNumRows, stageNumCols) {
        this.world = world;
        this.numWorldRows = numWorldRows;
        this.numWorldCols = numWorldCols;
        //this.worldRow = worldRow;
        //this.worldCol = worldCol;
        this.stageNumRows = stageNumRows;
        this.stageNumCols = stageNumCols;

        this.numRows = this.stageNumRows;
        this.numCols = this.stageNumCols;

        this.stage = {
            worldRow: worldRow,
            worldCol: worldCol,
            pieces: [],
        };
        this.matrix = new Array(this.numRows);
        for (let row = 0; row < this.numRows; row++) {
            this.matrix[row] = new Array(this.numRows);
        }

        this.buildExits();
        this.buildBorder();
        this.buildSpawn();

        this.insertIntoWorld();
        console.log(JSON.stringify(this.world));

        //this.lev = JSON.stringify(this.stage);
    }

    insertIntoWorld() {
        for (let i = 0; i < this.world.length; i++) {
            if (this.world[i].worldRow == this.stage.worldRow && this.world[i].worldCol == this.stage.worldCol) {
                this.world[i].pieces = this.stage.pieces;
                return;
            }
        }

        this.world.push(this.stage);
    }

    logWorld() {

    }

    getStage(worldRow, worldCol) {
        for (let i = 0; i < this.world.length; i++) {
            if (this.world[i].worldRow == worldRow && this.world[i].worldCol == worldCol) {
                return this.world[i];
            }
        }
        throw new Error("Not found");
    }

    // TODO: bottom-most and right-most stages should not have exits
    buildExits() {
        if (this.stage.worldRow > 0) {
            // build top exit based on stage from above
            throw new Error("unimplemented");
        }
        if (this.stage.worldCol > 0) {
            // build left exit based on stage from left
            //throw new Error("unimplemented");
            const prevStage = this.getStage(this.stage.worldRow, this.stage.worldCol - 1);
            for (let i = 0; i < prevStage.pieces.length; i++) {
                const p = prevStage.pieces[i];
                if (p.col == this.numCols - 1 && p.typ == "token") {
                    this.maybeAddPiece("token", p.row, 0);
                }
            }
        }

        const ROW_JITTER_SPAN = Math.floor(this.numRows / 2);
        const COL_JITTER_SPAN = Math.floor(this.numCols / 2);
        /*const z = new Set();
        for (let i = 0; i < 1000; i++) {
            const exitRow = Math.floor((Math.floor(Math.random() * ROW_JITTER_SPAN) - Math.floor(ROW_JITTER_SPAN / 2)) + Math.floor(this.numRows / 2));
            z.add(exitRow);
        }
        console.log(z);*/

        const exitRow = Math.floor((Math.floor(Math.random() * ROW_JITTER_SPAN) - Math.floor(ROW_JITTER_SPAN / 2)) + Math.floor(this.numRows / 2));        
        this.maybeAddPiece("token", exitRow, this.numCols - 1);

        const exitCol = Math.floor((Math.floor(Math.random() * COL_JITTER_SPAN) - Math.floor(COL_JITTER_SPAN / 2)) + Math.floor(this.numCols / 2));
        this.maybeAddPiece("token", this.numRows - 1, exitCol);


    }

    buildSpawn() {
        this.maybeAddPiece("spawn", Math.floor(this.numRows / 2),  Math.floor(this.numCols / 2));
    }

    maybeAddPiece(typ, row, col) {
        if (this.matrix[row][col]) {
            return false;
        } else {
            const piece = {
                typ: typ,
                row: row,
                col: col,
            }
            this.stage.pieces.push(piece);
            this.matrix[row][col] = piece;
        }
    };

    buildBorder() {
        for (let r = 0; r < this.numRows; r++) {
            this.maybeAddPiece("trap", r, 0);
            this.maybeAddPiece("trap", r, this.numCols - 1);

            /*this.pieces.push({
                typ: "trap",
                row: r,
                col: 0,
            });
            this.pieces.push({
                typ: "trap",
                row: r,
                col: this.numCols - 1,
            });*/
        }

        for (let c = 1; c < this.numCols - 1; c++) {
            this.maybeAddPiece("trap", 0, c);
            this.maybeAddPiece("trap", this.numRows - 1, c);
        }
    }
}


//const WORLD = [];
//const GEN = new LevelGenerator(WORLD, WORLD_ROWS, WORLD_COLS, 0, 1, GAME_NUM_ROWS, GAME_NUM_COLS);



/*const PIECES = compileWorld(WORLD);

for (let i = 0; i < NUM_BLOCKS; i++) {
    const piece = {
        typ: "block",
        row: getRandomInt(0, GAME_NUM_ROWS),
        col: getRandomInt(0, GAME_NUM_COLS),
    };

    //if (piece.row)

    PIECES.push(piece);
}*/

//const PIECES = WORLD[1].pieces;
//const PIECES = GEN.pieces;
//const PIECES = [{"typ":"token","row":9,"col":15},{"typ":"token","row":15,"col":4},{"typ":"trap","row":0,"col":0},{"typ":"trap","row":0,"col":15},{"typ":"trap","row":1,"col":0},{"typ":"trap","row":1,"col":15},{"typ":"trap","row":2,"col":0},{"typ":"trap","row":2,"col":15},{"typ":"trap","row":3,"col":0},{"typ":"trap","row":3,"col":15},{"typ":"trap","row":4,"col":0},{"typ":"trap","row":4,"col":15},{"typ":"trap","row":5,"col":0},{"typ":"trap","row":5,"col":15},{"typ":"trap","row":6,"col":0},{"typ":"trap","row":6,"col":15},{"typ":"trap","row":7,"col":0},{"typ":"trap","row":7,"col":15},{"typ":"trap","row":8,"col":0},{"typ":"trap","row":8,"col":15},{"typ":"trap","row":9,"col":0},{"typ":"trap","row":10,"col":0},{"typ":"trap","row":10,"col":15},{"typ":"trap","row":11,"col":0},{"typ":"trap","row":11,"col":15},{"typ":"trap","row":12,"col":0},{"typ":"trap","row":12,"col":15},{"typ":"trap","row":13,"col":0},{"typ":"trap","row":13,"col":15},{"typ":"trap","row":14,"col":0},{"typ":"trap","row":14,"col":15},{"typ":"trap","row":15,"col":0},{"typ":"trap","row":15,"col":15},{"typ":"trap","row":0,"col":1},{"typ":"trap","row":15,"col":1},{"typ":"trap","row":0,"col":2},{"typ":"trap","row":15,"col":2},{"typ":"trap","row":0,"col":3},{"typ":"trap","row":15,"col":3},{"typ":"trap","row":0,"col":4},{"typ":"trap","row":0,"col":5},{"typ":"trap","row":15,"col":5},{"typ":"trap","row":0,"col":6},{"typ":"trap","row":15,"col":6},{"typ":"trap","row":0,"col":7},{"typ":"trap","row":15,"col":7},{"typ":"trap","row":0,"col":8},{"typ":"trap","row":15,"col":8},{"typ":"trap","row":0,"col":9},{"typ":"trap","row":15,"col":9},{"typ":"trap","row":0,"col":10},{"typ":"trap","row":15,"col":10},{"typ":"trap","row":0,"col":11},{"typ":"trap","row":15,"col":11},{"typ":"trap","row":0,"col":12},{"typ":"trap","row":15,"col":12},{"typ":"trap","row":0,"col":13},{"typ":"trap","row":15,"col":13},{"typ":"trap","row":0,"col":14},{"typ":"trap","row":15,"col":14},{"typ":"spawn","row":8,"col":8}];

class Game {
    constructor(world, worldNumRows, worldNumCols, worldStartRow, worldStartCol, stageNumRows, stageNumCols) {
        this.world = world;
        this.worldNumRows = worldNumRows;
        this.worldNumCols = worldNumCols;
        this.worldStartRow = worldStartRow;
        this.worldStartCol = worldStartCol;
        this.currentWorldRow = worldStartRow;
        this.currentWorldCol = worldStartCol;

        this.pieces = this.compileWorld(this.world);
        this.randomBlocks();

        this.stageNumRows = stageNumRows;
        this.stageNumCols = stageNumCols;

        this.numRows = this.stageNumRows;
        this.numCols = this.stageNumCols * 2 - 1;

        this.matrix = new Array(this.numRows);
        this.ball = null;
        this.begun = false;
        this.momentum = null;

        for (let row = 0; row < this.numRows; row++) {
            this.matrix[row] = new Array(this.numCols);
            /*for (let col = 0; col < this.numCols; col++) {
                this.matrix[row][col] = undefined;
            }*/
        }

        for (let i = 0; i < this.pieces.length; i++) {
            const piece = this.pieces[i];
            this.addPiece(piece);
        }
    }

    compileWorld(world) {
        this.worldMatrix = new Array(this.worldNumRows);
        for (let r = 0; r < this.worldNumRows; r++) {
            this.worldMatrix[r] = new Array(this.worldNumCols);
            /*for (let col = 0; col < this.numCols; col++) {
                this.matrix[row][col] = undefined;
            }*/
        }

        const pieces = [];
        for (let i = 0; i < world.length; i++) {
            const stage = world[i];
            const wr = stage.worldRow;
            const wc = stage.worldCol;
            const wp = stage.pieces;
            this.worldMatrix[wr][wc] = stage;
            for (let j = 0; j < wp.length; j++) {
                const piece = wp[j];
                piece.row += (GAME_NUM_ROWS - 1) * wr;
                piece.col += (GAME_NUM_ROWS - 1) * wc;
                pieces.push(piece);
                if (piece.typ == "spawn") {
                    stage.spawn = piece;
                    piece.worldRow = wr;
                    piece.worldCol = wc;
                }
            }
        }
        return pieces;
    }

    randomBlocks() {
        for (let i = 0; i < NUM_BLOCKS; i++) {
            const piece = {
                typ: "block",
                row: getRandomInt(0, GAME_NUM_ROWS),
                col: getRandomInt(0, GAME_NUM_COLS),
            };

            //if (piece.row)

            this.pieces.push(piece);
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
        if (piece.typ === "spawn" && piece.worldRow == this.worldStartRow && piece.worldCol == this.worldStartCol) {
            const ballPiece = {
                typ: "ball",
                row: piece.row,
                col: piece.col,
            }
            this.ball = ballPiece;
            this.spawnPiece = piece;
        }
        if (this.matrix[piece.row][piece.col] === undefined) {
            this.matrix[piece.row][piece.col] = piece;
        }
    }

    respawn() {
        this.ball.row = this.spawnPiece.row;
        this.ball.col = this.spawnPiece.col;
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
            this.momentum = null;
            return { trapped: beforePiece};
        }

        if (beforePiece && beforePiece.typ === "spawn" && this.momentum) {
            this.momentum = null;
            return null;
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

        if (arrivedAtPiece != undefined && arrivedAtPiece.typ == "spawn") {
        //if (this.cellContainsBlock(arrivedAtCell)) {
            // TODO
            this.spawnPiece = arrivedAtPiece;
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
        this.trackingBall = false;
        this.trackingStage = true;
        this.stageTween = null;

        

        // The coordinates for the center of the *container* (not the stage)
        this.center = {
            x: 0,
            y: 0,
        };

        if (this.trackingBall) {

            this.centerBall();
        } else if (this.trackingStage) {
            this.centerStage();
        }
        this.placeCamera();
        this.zoom(scale);
    }

    centerBall() {
        const ballX = this.viz.ballAnimation.x;
        const ballY = this.viz.ballAnimation.y;
        this.center.x = (ballX + BLOCK_SIZE / 2) * this.scale;
        this.center.y = (ballY + BLOCK_SIZE / 2) * this.scale;
        //console.log(this.center);
    }

    getCenterStageXy(wr, wc) {
        const x = ((wc * (this.game.stageNumCols - 1)) + ((this.game.stageNumCols - 0) / 2)) * BLOCK_SIZE * this.scale;
        const y = ((wr * (this.game.stageNumRows - 1)) + ((this.game.stageNumRows - 0) / 2)) * BLOCK_SIZE * this.scale;
        return {
            x: x,
            y: y
        };
        
    }

    // center stage (as in level), as opposed to stage (as in createjs stage)
    centerStage() {
        //const stage = this.game.worldMatrix[this.game.currentWorldRow][this.game.currentWorldCol];
        //const centerStageX = stage.spawn.animation.x;
        //const centerStageY = stage.spawn.animation.y;
        //console.log(spawnX, spawnY)
        //const x = ((this.game.currentWorldCol * (this.game.stageNumCols - 1)) + ((this.game.stageNumCols - 0) / 2)) * BLOCK_SIZE;
        //const y = ((this.game.currentWorldRow * (this.game.stageNumRows - 1)) + ((this.game.stageNumRows - 0) / 2)) * BLOCK_SIZE;
        const xy = this.getCenterStageXy(this.game.currentWorldRow, this.game.currentWorldCol);
        this.center.x = xy.x;
        this.center.y = xy.y;
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

    centerStageTween() {
        if (this.stageTween.numPastTicks >= STAGE_TWEEN_TICKS) {
            this.stageTween.controllerCallback();
            this.stageTween = null;
            this.trackingStage = true;
        } else {
            this.stageTween.numPastTicks += 1;
            const p = this.stageTween.numPastTicks / STAGE_TWEEN_TICKS;
            const deltaX = this.stageTween.toXy.x - this.stageTween.fromXy.x;
            const deltaY = this.stageTween.toXy.y - this.stageTween.fromXy.y;
            const newX = deltaX * p + this.stageTween.fromXy.x;
            const newY = deltaY * p + this.stageTween.fromXy.y;
            this.center.x = newX;
            this.center.y = newY;
        }
    }

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
                piece.animation = drawSprite(piece, "spawn");
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
                color0a:[0,11,"color1a"],
                color0b:[1,11,"color1a"],
                color0c:[2,11,"color1a"],
                color0d:[3,11,"color1a"],
                color0e:[4,11,"color1a"],
                color0f:[5,11,"color1a"],
                color0g:[6,11,"color1a"],
                color0h:[7,11,"color1a"],
                color0i:[8,11,"color1a"],
                color0j:[9,11,"color1a"],
                color0k:[10,11,"color1a"],

                color1a:[0,11,"color2a"],
                color1b:[1,11,"color2a"],
                color1c:[2,11,"color2a"],
                color1d:[3,11,"color2a"],
                color1e:[4,11,"color2a"],
                color1f:[5,11,"color2a"],
                color1g:[6,11,"color2a"],
                color1h:[7,11,"color2a"],
                color1i:[8,11,"color2a"],
                color1j:[9,11,"color2a"],
                color1k:[10,11,"color2a"],
                
                color2a:[0,11,"color3a"],
                color2b:[1,11,"color3a"],
                color2c:[2,11,"color3a"],
                color2d:[3,11,"color3a"],
                color2e:[4,11,"color3a"],
                color2f:[5,11,"color3a"],
                color2g:[6,11,"color3a"],
                color2h:[7,11,"color3a"],
                color2i:[8,11,"color3a"],
                color2j:[9,11,"color3a"],
                color2k:[10,11,"color3a"],

                color3a:[0,11,"color4a"],
                color3b:[1,11,"color4a"],
                color3c:[2,11,"color4a"],
                color3d:[3,11,"color4a"],
                color3e:[4,11,"color4a"],
                color3f:[5,11,"color4a"],
                color3g:[6,11,"color4a"],
                color3h:[7,11,"color4a"],
                color3i:[8,11,"color4a"],
                color3j:[9,11,"color4a"],
                color3k:[10,11,"color3a"],

                color4a:[0,15,"color0a"],
            }
        };
        const tokenSpriteSheet = new createjs.SpriteSheet(tokenSheetData);
        //const trapAnimation = new createjs.Sprite(trapSpriteSheet);
        //this.queueResult["trap"] = trapAnimation;
        this.queueResult["token"] = {
            sheet: tokenSpriteSheet,
            init: function(animation) {
                //animation.gotoAndPlay("shut");
                //animation.gotoAndPlay("color");

                const n = Math.floor(Math.random() * 4);
                const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];
                const l = letters[Math.floor(Math.random()*letters.length)];
                const name = "color" + n + l;
                animation.gotoAndPlay(name);

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
            animations: {
                color:[0,5,"color"],
            },
        };
        const ballSpriteSheet = new createjs.SpriteSheet(ballSheetData);
        ballSpriteSheet.framerate = 15

        this.queueResult["ball"] = {
            sheet: ballSpriteSheet,
            init: function(animation){
                animation.gotoAndPlay(0);
            }
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
        line.graphics.setStrokeStyle(0.5).beginStroke("#99f");
        line.graphics.moveTo(0, rowIndex * BLOCK_SIZE);
        line.graphics.lineTo(this.game.numCols * BLOCK_SIZE, rowIndex * BLOCK_SIZE);
        line.graphics.endStroke();
    }

    drawVertGridLine(colIndex, line) {
        line.graphics.setStrokeStyle(0.5).beginStroke("#99f");
        line.graphics.moveTo(colIndex * BLOCK_SIZE, 0);
        line.graphics.lineTo(colIndex * BLOCK_SIZE, this.game.numRows * BLOCK_SIZE);
        line.graphics.endStroke();
    }

    handleTick(event) {
        if (this.camera.trackingBall) {
            this.camera.centerBall();
            this.camera.placeCamera();
        } else if (this.camera.stageTween) {
            this.camera.centerStageTween();
            this.camera.placeCamera();
        } else if (this.camera.trackingStage) {
            this.camera.centerStage();
            this.camera.placeCamera();
        } 
        this.stage.update(event);
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

    respawn(controllerCallback) {
        /*const movement = {
            newRow: this.game.spawnPiece.row,
            newCol: this.game.spawnPiece.col,
        }
        this.drawBallMove(movement);*/
        const destX = this.game.spawnPiece.col * BLOCK_SIZE;
        const destY = this.game.spawnPiece.row * BLOCK_SIZE;
        this.ballAnimation.x = destX;
        this.ballAnimation.y = destY;
        controllerCallback();
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
        // TODO: If stage tween then disable zoom
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

    // TODO: this belongs in viz.camera
    beginStageTween(from, to) {
        //this.disableMove();
        //const deltaWorldRow = to.wr - from.wr;
        //const deltaWorldCol = to.wc - from.wc;

        const fromXy = this.viz.camera.getCenterStageXy(from.wr, from.wc);
        const toXy = this.viz.camera.getCenterStageXy(to.wr, to.wc);

        console.log(fromXy, toXy);
        const THIS = this;

        this.viz.camera.trackingStage = false;
        this.viz.camera.trackingBall = false;
        this.viz.camera.stageTween = {
            fromXy: fromXy,
            toXy: toXy,
            numPastTicks: 0,
            controllerCallback: function() {
                console.log("asdf")
                // TODO: put in game class
                THIS.game.currentWorldRow = to.wr;
                THIS.game.currentWorldCol = to.wc;
                //THIS.game.spawnPiece = THIS.game.world[]

            }
        };

        //const xPixelDistance = deltaWorldCol * (this.game.stageNumCols * this.viz.camera.scale * BLOCK_SIZE) - (BLOCK_SIZE * this.viz.camera.scale) / 2;
        //const xPixelDistance = deltaWorldCol * ((this.game.stageNumCols - 1) * this.game.currentWorldCol * BLOCK_SIZE)

        //const yPixelDistance = deltaWorldRow * (this.game.stageNumRows * this.viz.camera.scale * BLOCK_SIZE) - (BLOCK_SIZE * this.viz.camera.scale) / 2;
        
        //console.log(xPixelDistance, yPixelDistance);
        /*this.stageTweenIncrement = {
            //STAGE_TWEEN_TICKS
        };
        this.stageTween = {
            from: from,
            to: to,
            tickProgress: 0,
        };*/
    }

    up() {
        if (!this.enabledMovement || this.viz.camera.stageTween) {
            return;
        }
        this.go(-1, 0);
    }
    
    down() {
        if (!this.enabledMovement || this.viz.camera.stageTween) {
            return;
        }
        this.go(1, 0);
    }
    
    left() {
        if (!this.enabledMovement || this.viz.camera.stageTween) {
            return;
        }
        this.go(0, -1);
    }
    
    right() {
        if (!this.enabledMovement || this.viz.camera.stageTween) {
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
            console.log("trapped", movement, this.game.ball)

            this.viz.drawTrapShut(movement, function(){
                console.log(2);
                THIS.game.respawn();
                THIS.viz.respawn(function(){
                    THIS.enableMove();
                });
            });
        } else if (movement) {
            const THIS = this;

            //console.log("move", movement, this.game.ball, this.game.matrix[this.game.ball.row][this.game.ball.col])
            // if on level boundary
            if ((this.game.ball.row % (this.game.stageNumRows - 1) == 0 || 
                this.game.ball.col % (this.game.stageNumCols - 1) == 0) &&
                (this.game.matrix[this.game.ball.row][this.game.ball.col] === undefined || 
                 this.game.matrix[this.game.ball.row][this.game.ball.col].typ != "trap")) {
                this.launchStageTeeen(deltaRow, deltaCol);
            }

            this.viz.drawBallMove(movement, function(){
                THIS.go(deltaRow, deltaCol);

                /*if (THIS.game.ball.row % (THIS.game.stageNumRows - 1) == 0 || 
                    THIS.game.ball.col % (THIS.game.stageNumCols - 1) == 0) {
                    THIS.launchStageTeeen(deltaRow, deltaCol);
                }*/
            });

            
        } else {
            this.enableMove();
        }
    }

    launchStageTeeen(deltaRow, deltaCol) {
        const from = {
            wr: this.game.currentWorldRow,
            wc: this.game.currentWorldCol,
        };
        const to = {
            wr: from.wr + deltaRow,
            wc: from.wc + deltaCol,
        };
        this.beginStageTween(from, to);
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
            GAME = new Game(WORLD, WORLD_ROWS, WORLD_COLS, WORLD_START_ROW, WORLD_START_COL, GAME_NUM_ROWS, GAME_NUM_COLS);
            VIZ = new Viz(queue, GAME, "rb-world-canvas", START_SCALE, MODE);
            CONTROLLER = new Controller(GAME, VIZ);
        } /*else {
            GAME = new Game(GAME_NUM_ROWS, GAME_NUM_COLS, PIECES);
            VIZ = new Viz(queue, GAME, "rb-world-canvas", START_SCALE, MODE);
            CONTROLLER = new Controller(GAME, VIZ);
        }*/
    }
}
