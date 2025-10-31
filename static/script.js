const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
let snake = [];
let direction = "RIGHT";
let food = {};
let score = 0;
let game = null;
let snakeSpeed = 120;
let gameOverActive = false;
let neonGlow = 0;
let glowDirection = 1;

document.addEventListener("keydown", changeDirection);
document.addEventListener("keydown", restartOnSpace);
canvas.addEventListener("click", handleCanvasClick);

function startGame(speed){
    snakeSpeed = speed;
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
    document.getElementById("score").style.display = "block";
    snake = [{x:200,y:200}];
    direction = "RIGHT";
    score = 0;
    updateScore();
    spawnFood();
    gameOverActive = false;
    if(game) clearInterval(game);
    game = setInterval(draw, snakeSpeed);
}

function showMenu(){
    document.getElementById("menu").style.display = "block";
    document.getElementById("gameCanvas").style.display = "none";
    document.getElementById("score").style.display = "none";
}

window.startGame = startGame;
window.showMenu = showMenu;

function changeDirection(event){
    if(event.key==="ArrowUp"&&direction!=="DOWN") direction="UP";
    if(event.key==="ArrowDown"&&direction!=="UP") direction="DOWN";
    if(event.key==="ArrowLeft"&&direction!=="RIGHT") direction="LEFT";
    if(event.key==="ArrowRight"&&direction!=="LEFT") direction="RIGHT";
}

function restartOnSpace(event){
    if(event.code==="Space"&&gameOverActive) showMenu();
}

function spawnFood(){
    food={x:Math.floor(Math.random()*20)*box,y:Math.floor(Math.random()*20)*box};
}

function updateScore(){
    document.getElementById("score").innerText="Lines of Code: "+score;
}

function draw(){
    ctx.fillStyle="#1a1a1a";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle="#2c2c3c";
    for(let i=0;i<=canvas.width/box;i++){
        ctx.beginPath();
        ctx.moveTo(i*box,0);
        ctx.lineTo(i*box,canvas.height);
        ctx.stroke();
    }
    for(let j=0;j<=canvas.height/box;j++){
        ctx.beginPath();
        ctx.moveTo(0,j*box);
        ctx.lineTo(canvas.width,j*box);
        ctx.stroke();
    }

    for(let i=0;i<snake.length;i++){
        ctx.beginPath();
        ctx.arc(snake[i].x+box/2,snake[i].y+box/2,box/2,0,2*Math.PI);
        ctx.fillStyle=i===0?"#0070c0":(i%2===0?"#33cc33":"#3399cc");
        ctx.fill();
        ctx.strokeStyle="#003300";
        ctx.stroke();
        ctx.closePath();

        if(i===0){
            ctx.beginPath();
            ctx.arc(snake[i].x+box/4,snake[i].y+box/3,2,0,2*Math.PI);
            ctx.arc(snake[i].x+3*box/4,snake[i].y+box/3,2,0,2*Math.PI);
            ctx.fillStyle="#fff";
            ctx.fill();
            ctx.closePath();
        }
    }

    ctx.save();
    ctx.translate(food.x+box/2,food.y+box/2);
    ctx.rotate(Math.PI/4);
    ctx.fillStyle="#00aaff";
    ctx.shadowColor="#00aaff";
    ctx.shadowBlur=8;
    ctx.fillRect(-box/2,-box/2,box,box);
    ctx.restore();
    ctx.fillStyle="#fff";
    ctx.font="12px 'Press Start 2P'";
    ctx.fillText(".py",food.x+2,food.y+14);

    let snakeX=snake[0].x;
    let snakeY=snake[0].y;
    if(direction==="LEFT") snakeX-=box;
    if(direction==="RIGHT") snakeX+=box;
    if(direction==="UP") snakeY-=box;
    if(direction==="DOWN") snakeY+=box;

    if(snakeX===food.x && snakeY===food.y){
        score++;
        updateScore();
        spawnFood();
    } else snake.pop();

    snake.unshift({x:snakeX,y:snakeY});

    if(snakeX<0||snakeX>=canvas.width||snakeY<0||snakeY>=canvas.height||collision(snakeX,snakeY,snake)){
        clearInterval(game);
        gameOverActive=true;
        ctx.fillStyle="rgba(0,0,0,0.7)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="red";
        ctx.font="16px 'Press Start 2P'";
        ctx.textAlign="center";
        ctx.fillText(randomGameOver(),canvas.width/2,canvas.height/2);

        neonGlow+=glowDirection*0.5;
        if(neonGlow>8||neonGlow<2) glowDirection*=-1;
        ctx.fillStyle="#555555";
        ctx.shadowColor="#555555";
        ctx.shadowBlur=neonGlow;
        ctx.fillRect(canvas.width/2-50,canvas.height/2+20,100,30);
        ctx.fillStyle="#dddddd";
        ctx.shadowBlur=0;
        ctx.font="10px 'Press Start 2P'";
        ctx.textBaseline="middle";
        ctx.fillText("REINICIAR",canvas.width/2,canvas.height/2+35);
        return;
    }
}

function collision(x,y,array){
    for(let i=1;i<array.length;i++){
        if(x===array[i].x && y===array[i].y) return true;
    }
    return false;
}

function randomGameOver(){
    const msgs=["PYTHON CRASH!","SYNTAX ERROR!","RUNTIME ERROR!","PROCESS TERMINATED."];
    return msgs[Math.floor(Math.random()*msgs.length)];
}

function handleCanvasClick(event){
    if(!gameOverActive) return;
    const rect=canvas.getBoundingClientRect();
    const clickX=event.clientX-rect.left;
    const clickY=event.clientY-rect.top;
    if(clickX>=canvas.width/2-50 && clickX<=canvas.width/2+50 &&
       clickY>=canvas.height/2+20 && clickY<=canvas.height/2+50){
        showMenu();
    }
}