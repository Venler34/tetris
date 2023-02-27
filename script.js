// rows = 20, columns = 10

window.addEventListener('load', function() {
    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 1000;
    rows = 20;
    cols = 10;
    class InputHandler {
        constructor(game) {
            this.game = game;
            window.addEventListener("keydown", e => {
                if(e.key === "a" && !game.keys.includes("a")) {
                    game.keys.push("a")
                } else if(e.key === "d" && !game.keys.includes("d")) {
                    game.keys.push("d")
                }
            })
            window.addEventListener("keyup", e => {
                const index = game.keys.indexOf(e.key)
                if(index > -1) {
                    game.keys.splice(index, 1);
                }
            })
        }
    }
    class Block {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.length = canvas.height / rows;
            this.color = color;
        }
        updateY() {
            this.y += 1;
        }
        updateX(speedX) {
            this.x += speedX;
        }
        canUpdateX(speedX, board, backgroundColor) {
            if(this.x + speedX >= cols || this.x + speedX < 0){
                return false;
            }
            else if(board[this.y][this.x + speedX] != backgroundColor){
                return false;
            }
            return true;
        }
        canUpdateY(board, backgroundColor) {
            if(this.y + 1 >= rows){
                return false;
            }
            else if(board[this.y+1][this.x] != backgroundColor){
                return false;
            }
            return true;
        }
        draw(context) {
            context.fillStyle = this.color;
            context.fillRect(this.x * this.length, this.y * this.length, this.length-1, this.length-1);
        }
        printCords() {
            console.log("(" + this.x + "," + this.y + ")");
        }
    }
    class Tetromino {
        constructor(game) {
            this.game = game;
            this.speedX = 0;
            this.maxSpeed = 1;
            this.markedForDeletion = false;
        }
        update() {
            if(this.game.keys.includes("a")) {
                this.speedX = -this.maxSpeed;
            } else if (this.game.keys.includes("d")) {
                this.speedX = this.maxSpeed;
            } else {
                this.speedX = 0;
            }

            const board = this.removeCords(this.game.board);
            const backgroundColor = this.game.backgroundColor;
            

            //checks if can update x and then updates it

            let canUpdateX = true;
            this.blocks.forEach(block => {
                canUpdateX = canUpdateX && block.canUpdateX(this.speedX, board, backgroundColor);
            });
            if(canUpdateX){
                this.blocks.forEach(block => { 
                    block.updateX(this.speedX);
                })
            }

            //checks if can update y and then updates it

            let canUpdateY = true;
            this.blocks.forEach(block => {
                canUpdateY = canUpdateY && block.canUpdateY(board, backgroundColor);
            });
            if(canUpdateY){
                this.blocks.forEach(block => { 
                    block.updateY();
                })
            }

            return canUpdateY;
        }
        removeCords(board) {
            this.blocks.forEach(block => { 
                board[block.y][block.x] = this.game.backgroundColor;
            })
            return board;
        }
        getBlocks() {
            return this.blocks;
        }
    }
    class Straight extends Tetromino{
        constructor(game, color){
            super(game);
            this.blocks = [];
            this.length = 4;
            this.color = color;
            let start = (cols - this.length) / 2;
            for(let i = start; i < start + this.length; i++) {
                const xCord = i;
                const yCord = 0; //top of tetris board
                this.blocks.push(new Block(xCord, yCord, this.color));
            }
        }
        draw(context) {
            this.blocks.forEach(block => block.draw(context));
        }
    }
    class Square {
        constructor(game, color) {
            super(game);
            this.blocks = [];
            this.length = 2;
            this.color = color;
            
        }
    }
    class Skew {

    }
    class L {

    }
    class T {

    }
    class UI {

    }
    class Game {
        constructor() {
            this.inputHandler = new InputHandler(this);
            this.blocks = ["Straight","Square","Skew","L","T"];
            this.needNewBlock = true;
            this.dropTime = 1000;
            this.currentTime = 0;
            this.keys = [];
            this.board = [];
            this.backgroundColor = 'black';
            this.blockLength = canvas.height / rows;
            for(let row = 0; row < rows; row++){
                let currRow = [];
                for(let col = 0; col < cols; col++){
                    currRow.push(this.backgroundColor);
                }
                this.board.push(currRow);
            }
        }
        getBlock() {
            let blockNum = 0;//parseInt(Math.random() * this.blocks.length, 10);
            if(this.blocks[blockNum] === "Straight") {
                return new Straight(this, 'blue')

            } else if(this.blocks[blockNum] === "Square") {

            } else if(this.blocks[blockNum] === "Skew") {

            } else if(this.blocks[blockNum] === "L") {

            } else if(this.blocks[blockNum] === "T") {

            }
        }
        createBlock() {
            this.block = this.getBlock();
        }
        update(deltaTime) {
            if(this.currentTime >= this.dropTime){
                if(this.needNewBlock) {
                    this.createBlock();
                    this.needNewBlock = false;
                } else {
                    this.updateBoard();
                }
                this.currentTime = 0;
            } else {
                this.currentTime += deltaTime;
            }
        }
        updateBoard() {
            this.needNewBlock = !this.block.update();

            //update board. The block was removed previously
            const blocks = this.block.getBlocks();
            blocks.forEach(block => {
                this.board[block.y][block.x] = this.block.color;
            })
        }
        // //Determines if Tetromino collides
        // tetrominoCollides(blocks) {
        //     isInvalidSpot = false;
        //     blocks.forEach(block => {
        //         if(block.y <= rows) {
        //             isInvalidSpot = true;
        //         }
        //         else if(this.board[block.y][block.x] != this.backgroundColor) {
        //             isInvalidSpot = true;
        //         }
        //     })
        //     return isInvalidSpot;
        // }
        draw(context) {
            for(let row = 0; row < rows; row++){
                for(let col = 0; col < cols; col++){
                    const color = this.board[row][col];
                    context.fillStyle = color;
                    context.fillRect(col * this.blockLength, row * this.blockLength, this.blockLength-1, this.blockLength-1);
                }
            }
        }
    }
    const game = new Game();
    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
})