//BRICK BREAKER CLONE GAME

//Keydown event listeners for game inputs
window.addEventListener('keydown', (e)=>{
    keys[e.code] = true;
})
window.addEventListener("keyup", (e) =>{
    keys[e.code] = false;
})
//set up variables to hold the canvas and ctx objects
let canvas;
let ctx;

//player class that represents the paddle and the ball
let player;
let playerBall;

// dictionary of controls
let keys = {
    "ArrowRight" : false,
    "ArrowLeft" : false,
    "Space" : false
};
//level of the game and score
let level = 2;
let score = 0;

//array that holds all block objects
let blocks = [];

 

//initialize the game objects and begin game loop
let init = () =>{
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    ctx.canvas.width = document.documentElement.clientWidth;
    ctx.canvas.height = document.documentElement.clientHeight;
    window.requestAnimationFrame(gameLoop);
    player = new Player(canvas.width/2,canvas.height -50,canvas.width/12, canvas.height /20);
    playerBall = new Ball(((player.x + player.width / 2)), player.y - player.height/2,
                             canvas.width / 64, canvas.height / 40);
    playerBall.velocity = {x: -2, y: -1};


     
}

let gameLoop = () =>{
    draw();

    gameLogic();

    window.requestAnimationFrame(gameLoop);
}

let gameLogic = () =>{
    //player controls
    if(keys["ArrowLeft"])
    {
        player.move("left");
    }
    if(keys["ArrowRight"])
    {
        player.move("right");
    }

    //check for collisions between blocks and ball or player and ball
    for(let i=0; i< blocks.length; i++)
    {
        for(let j=0; j< blocks[i].length; j++)
        {
            if(blocks[i][j] != null)
            {
                if(checkCollision(playerBall, blocks[i][j])){
                    playerBall.bounce();
                    blocks[i][j].destroy();
                    blocks[i][j] = null;
                }
            }
        }
    }
    if(checkCollision(player, playerBall))
    {
        playerBall.bounce();
    }

    playerBall.updateBallPosition();
}

let draw = () =>{
    //clear the canvas before every redraw
    ctx.clearRect(0,0,canvas.width,canvas.height);

    //loop through all blocks and draw them to canvas
    for(let i=0; i < blocks.length; i++)
    {
        for(let j=0; j < blocks[i].length; j++)
        {
            if(blocks[i][j] != null)
            {
                blocks[i][j].draw();
            }
            
        }
    }
    //draw player
    player.draw();
    playerBall.draw();
}

//get size of canvas and divide it by number of blocks to get size of blocks.
//Still need to add logic to take into account the space between blocks
let fillLevel = lvl =>{
    blocks = [];

    let blockwidth = canvas.width / 12;
    let blockheight = canvas.height / 20;
    for(let i=0; i<=10; i++)
    {
        blocks[i] = new Array(level * 2);

        for(let j=0; j < blocks[i].length; j++)
        {
            blocks[i][j] = new Block(blockwidth, blockheight, (blockwidth + 10) * i, (blockheight + 10) * j, '#' + parseInt(Math.random() * 0xffffff).toString(16));
        }
    }
}

// will check the collision of two rectangles and return false if there is 
//a collision
let checkCollision = (a, b) =>{
    if(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    ){
        return false;
    }else{
       return true;
    }
}

//the class of the block
class Block {
    constructor(width, height, x, y, color){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.ctx = ctx
    }

    draw(){
    ctx.fillStyle = this.color;
    ctx.strokeStyle = 'black';
    ctx.fillRect(this.x,this.y,this.width,this.height);
    ctx.strokeRect(this.x,this.y,this.width,this.height);
    }
    destroy(){
        score += 10;
    }
}

class Ball{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    
    
    velocity = {x: 0, y: 0};

    updateBallPosition(){
        this.x = this.x + this.velocity.x * level;
        this.y = this.y + this.velocity.y * level; 

        if(this.x + this.width >= canvas.width)
        {
            
            this.velocity.x = -this.velocity.x;
        }
        if(this.x <= 0)
        {
            
            this.velocity.x = -this.velocity.x;
        }
        if(this.y + this.height <= 0)
        {
            
            this.velocity.y = -this.velocity.y;
        }
        if(this.y >= canvas.height)
        {
            
            this.velocity.y = -this.velocity.y;
        }
    }


    bounce(){
        this.velocity.y = -this.velocity.y;
    }
    draw(){
        ctx.fillstyle = "white";
        ctx.strokeStyle = "black";
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.strokeRect(this.x,this.y,this.width,this.height);
    }
}

class Player{
    constructor(x,y,width, height){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    draw(){
        ctx.fillstyle = "white";
        ctx.strokeStyle = "white";
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.strokeRect(this.x,this.y,this.width,this.height);
    }

    move(direction){
        if(direction == "right")
        {
            if(this.x + this.width >= canvas.width)
            {
                return;
            }else{
                this.x += 8;
            }
        }else if(direction == "left"){
            if(this.x <= 0)
            {
                return;
            }else{
                this.x -= 8;
            }
        }
    }
}

init();
fillLevel();

