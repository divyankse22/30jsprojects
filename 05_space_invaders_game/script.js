document.fonts.load('10px ArcadeClassic').then(() => {
    // Font is loaded
    console.log('Font loaded');
});
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize*columns;
let boardHeight = tileSize*rows;
let context;

let shipWidth = 2*tileSize;
let shipHeight = tileSize;
let shipX = tileSize*columns/2-tileSize;
let shipY = tileSize*rows-2*tileSize;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight
}

let shipImg;
let shipVelocityX = tileSize;

let alienArray = [];
let alienChoices = ["./alien.png","./alien-cyan.png","./alien-magenta.png","./alien-yellow.png"];
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;
let alienVelocityX = 1;
let alienVelocityY = tileSize;

let bulletArray = [];
let bulletVelocity = -10;

let score = 0;
let gameOver = false;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // context.fillStyle = "green";
    // context.fillRect(ship.x,ship.y,ship.width,ship.height);
    shipImg = new Image();
    shipImg.src = "./ship.png"
    shipImg.onload = function(){
        context.drawImage(shipImg,ship.x,ship.y,ship.width,ship.height);
    }
    
    createAlien();
    requestAnimationFrame(update);
    document.addEventListener("keydown",moveShip);
    document.addEventListener("keyup",shoot);
}

function update(){
    requestAnimationFrame(update);  
    context.clearRect(0,0,board.width,board.height);  

    if(gameOver){
        context.fillStyle = "white";
        context.font = "48px ArcadeClassic";  
        context.fillText("Game Over", boardWidth/4, boardHeight/2);
        context.fillText(`Your Score: ${score}`, boardWidth/4, boardHeight/2 + 60);
        return;
    }

    context.drawImage(shipImg,ship.x,ship.y,ship.width,ship.height);
    for(let i = 0; i < alienArray.length;  i++){
        let alien = alienArray[i];
        if(alien.alive){
            alien.x += alienVelocityX;
            if(alien.x+alienWidth>=boardWidth||alien.x<=0){
                alienVelocityX *= -1;
                alien.x += alienVelocityX*2; 
                for(let j = 0 ; j < alienArray.length ; j++){
                    alienArray[j].y += alienVelocityY;
                }
            } 
            context.drawImage(alien.img,alien.x,alien.y,alien.width,alien.height);

            if(alien.y>=ship.y) gameOver = true;
        }
    }

    for(let i = 0; i < bulletArray.length ; i++){
        let bullet = bulletArray[i];
        bullet.y += bulletVelocity;
        context.fillStyle = "white";
        context.fillRect(bullet.x,bullet.y,bullet.width,bullet.height);

        for(let j = 0; j < alienArray.length; j++){
            let alien = alienArray[j];
            if(!bullet.used && alien.alive && detectCollision(bullet,alien)){
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score+=100;
            }
        }
    }

    while(bulletArray.length>0 && (bulletArray[0].used||bulletArray[0].y<0)){
        bulletArray.shift();
    }

    if(alienCount==0){
        alienColumns = Math.min(alienColumns+1,columns/2 -2);
        alienRows = Math.min(alienRows+1,rows-4);
        alienVelocityX += 0.2;
        alienArray=[];
        bulletArray=[];
        createAlien();
    }

    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score,5,20);
}
function moveShip(e){
    if(gameOver) return;
    if(e.code=="ArrowRight" && ship.x+shipVelocityX+ship.width<=board.width){
        ship.x += shipVelocityX; 
    }
    if(e.code=="ArrowLeft" && ship.x-shipVelocityX>=0){
        ship.x -= shipVelocityX; 
    }
}
function createAlien(){
    for(let c = 0; c < alienColumns ; c++){
        for(let r = 0; r < alienRows;  r++){
            let randomNumber = Math.floor(Math.random() * 4);
            alienImg = new Image();
            alienImg.src = alienChoices[randomNumber];
            let alien = {
                
                img : alienImg,
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}
function shoot(e){
    if(gameOver) return;
    if(e.code == "Space"){
        let bullet = {
            x : ship.x + shipWidth*15/32,
            y : ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        bulletArray.push(bullet);
    }
}
function detectCollision(a,b){
    return  a.x<b.x+b.width &&
            a.x+a.width>b.x && 
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}