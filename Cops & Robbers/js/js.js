var imageCopLoaded = false;
var imageCrimeLoaded = false;
var imageBackgroundLoaded = false;

canvas = document.getElementById('myCanvas');
if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
}

var pX = canvas.width / 2 - 25; //COP start
var pY = 50;
var eX = canvas.width / 2 - 25;//CRIMINAL start
var eY = 600;
var pDirection = "";
var eDirection = "";
var pSpeed = 15; //speed for both players
var bullet = [];
var bYp = 50 + 65; //bullet if from initial position
var bXp = pX;
var bXe = eX;
var bYe = 600 - 50;
var bSpeedE = -30; //bullet speeds
var bSpeedP = 30;
var copBLast = 0;
var WorL = "";
var crimeBLast = 0;
var gameDone = false;
var copScore = 0; 
var crimeScore = 0;

function help() {
    alert("Welcome to Prison Break V2! Objective is to hit other player with your bullet. \n\n There are two players: Criminal & Cop. \n\n Cop Controls: Arrow Keys, Enter to shoot. \n\n Player Controls: WASD, Shift to shoot. \n\n Direction of shot is what direction you last went in. \n\n Ex. If you last up arrow, you will shoot up.");
}

function playerImage() {
    pImage = new Image();
    pImage.src = 'images/playr.png';
    pImage.onload = function() {
        imageCopLoaded = true;
    };
}

function enemyImage() {
    eImage = new Image();
    eImage.src = 'images/enemi.png';
    eImage.onload = function() {
        imageCrimeLoaded = true;
    };
}

var keysDown = {};

addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);

function update() {
    //cop
    if (38 in keysDown && pY > 10) {
        pY -= pSpeed;
        pDirection = "u";
        bYp = pY - pSpeed - 50;
        bXp = pX;
        bSpeedP = -20;
    }
    if (40 in keysDown && pY < canvas.height - 60) {
        pY += pSpeed;
        pDirection = "d";
        bYp = pY + pSpeed + 50;
        bXp = pX;
        bSpeedP = 20;
    }
    if (37 in keysDown && pX > 10) {
        pX -= pSpeed;
        pDirection = "l";
        bXp = pX - pSpeed - 50;
        bYp = pY;
        bSpeedP = -20;
    }
    if (39 in keysDown && pX < canvas.width - 60) {
        pX += pSpeed;
        pDirection = "r";
        bXp = pX + pSpeed + 50;
        bYp = pY;
        bSpeedP = 20;
    }

    //if bullet is shot, added to bullet array
    if (13 in keysDown && Date.now() - copBLast > 400) {
        bullet.push({
            x: bXp,
            y: bYp,
            direction: pDirection,
            speed: bSpeedP,
            dSwitch: false,
            color: "blue",
            firedBy: "c", //this is for when it is shot from initial position, needs to determine which direction will go in
        });

        //limits how many times you can shoot (1 per sec)
        copBLast = Date.now();
    }

    //crime
    if (87 in keysDown && eY > 10) {
        eY -= pSpeed;
        eDirection = "u";
        bYe = eY - pSpeed - 50;
        bXe = eX;
        bSpeedE = -20;
    }
    if (83 in keysDown && eY < canvas.height - 60) {
        eY += pSpeed;
        eDirection = "d";
        bYe = eY + pSpeed + 50;
        bXe = eX;
        bSpeedE = 20;
    }
    if (65 in keysDown && eX > 10) {
        eX -= pSpeed;
        eDirection = "l";
        bXe = eX - pSpeed - 50;
        bYe = eY;
        bSpeedE = -20;
    }
    if (68 in keysDown && eX < canvas.width - 60) {
        eX += pSpeed;
        eDirection = "r";
        bXe = eX + pSpeed + 50;
        bYe = eY;
        bSpeedE = 20;
    }

    //if bullet shot, added to bullet array
    if (16 in keysDown && Date.now() - crimeBLast > 400) {
        bullet.push({
            x: bXe,
            y: bYe,
            direction: eDirection,
            speed: bSpeedE,
            dSwitch: false,
            color: "red",
            firedBy: "e",  //this is for when it is shot from initial position, needs to determine which direction will go in
        });

        //limits how many times you can shoot (1 per sec)
        crimeBLast = Date.now();
    }
}

function showBullets() {
    //draws bullets in bullet array
    for (i = 0; i < bullet.length; i++) {
        ctx.beginPath();
        ctx.arc(bullet[i].x, bullet[i].y, 30, 0, Math.PI * 2, false);
        ctx.fillStyle = bullet[i].color;
        ctx.fill();
        ctx.closePath();

        //determines which coordinate to add speed to, based on initial shot direction
        if (bullet[i].direction == "u") {
            bullet[i].y += bullet[i].speed;
        } else if (bullet[i].direction == "d") {
            bullet[i].y += bullet[i].speed;
        } else if (bullet[i].direction == "l") {
            bullet[i].x += bullet[i].speed;
        } else if (bullet[i].direction == "r") {
            bullet[i].x += bullet[i].speed;
        }
        //below deals with if they shot from starting position (no movement key pressed)
        else if (bullet[i].firedBy == "e") {
            bullet[i].y += bullet[i].speed;
        } else if (bullet[i].firedBy == "c") {
            bullet[i].y += bullet[i].speed;
        }

        //deals with bouncing off borders
        if (bullet[i].x + bullet[i].speed > canvas.width + 30) {
            bullet[i].speed = -bullet[i].speed;
        }if (bullet[i].y + bullet[i].speed > canvas.height + 40) {
            bullet[i].speed = -bullet[i].speed;
        }

       if (bullet[i].x + bullet[i].speed < -30) {
            bullet[i].speed = -bullet[i].speed;
        }if (bullet[i].y + bullet[i].speed < -30) {
            bullet[i].speed = -bullet[i].speed;
        }
    }
}

//checks if cops dies
function copCollision() {

    for (i = 0; i < bullet.length; i++) {
        var distXCop = Math.abs(bullet[i].x - pX - 45 / 2);
        var distYCop = Math.abs(bullet[i].y - pY - 45 / 2);

        //no collision
        if (distXCop > (25 / 2 + 20)) {
            continue;
        }
        if (distYCop > (25 / 2 + 20)) {
            continue;
        }

        //collision
        if (distXCop <= (25 / 2)) {
            return true;
        }
        if (distYCop <= (25 / 2)) {
            return true;
        }

        //Initially was a colision algrothim for circle-rectangle, this part still worked though so kept
        var dx = distXCop - 25 / 2;
        var dy = distYCop - 25 / 2;
        if (dx * dx + dy * dy <= (20 * 20)) {
            return true;
        }
    }
}

//checks if criminal dies
function criminalCollision() {

    for (i = 0; i < bullet.length; i++) {
        var distXCrime = Math.abs(bullet[i].x - eX - 45 / 2);
        var distYCrime = Math.abs(bullet[i].y - eY - 45 / 2);

        //no collision
        if (distXCrime > (25 / 2 + 20)) {
            continue;
        }
        if (distYCrime > (25 / 2 + 20)) {
            continue;
        }

        //collision
        if (distXCrime <= (25 / 2)) {
            return true;
        }
        if (distYCrime <= (25 / 2)) {
            return true;
        }

        //Initially was a colision algrothim for circle-rectangle, this part still worked though so kept
        var dx=distXCrime-25/2;
        var dy=distYCrime-25/2;
        if (dx*dx+dy*dy<=(20*20)){
          return true;
        }
    }
}

//Initializes animation loop then cancels the request, so that the variable can be used to cancel in draw method. 
var animationLoop = requestAnimationFrame(draw);
cancelAnimationFrame(animationLoop);

//main draw method, loops
function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showBullets();

    //if first time, loads images
    if (!imageCopLoaded || !imageCrimeLoaded) {
        playerImage();
        enemyImage();
    }

    //draws images
    ctx.drawImage(pImage, pX, pY);
    ctx.drawImage(eImage, eX, eY);

    //moves players
    update();

    //deals with win/loss
    if (copCollision()) {
        WorL = "copL";
        cancelAnimationFrame(animationLoop);
        gameDone = true;
        game();
        return;
    } else if (criminalCollision()) {
        WorL = "copW";
        cancelAnimationFrame(animationLoop);
        gameDone = true;
        game();
        return;
    }
    requestAnimationFrame(draw);
}

//DOM variables
var para;
var t;
var w;

//main game method, runs everything
function game() {

    if (!gameDone) {
        draw();
    }

    console.log(WorL);
    if (WorL == "copL") {

        w = document.getElementById('winner');
        para = document.getElementById("playerCom");
        t = document.createTextNode("The Criminal Has Won!");
        w.appendChild(t);
        crimeScore++;
        document.getElementById('criminalScore').innerHTML = crimeScore;
        playAgain();

        setTimeout(func, 2000);

        function func() {
            initializeVarsAgain();
            game();
        }


    } else if (WorL == "copW") {
        w = document.getElementById('winner');
        para = document.getElementById("playerCom");
        t = document.createTextNode("The Cop Has Won!");
        w.appendChild(t);
        copScore++;
        document.getElementById('copScore').innerHTML = copScore;
        playAgain();

        setTimeout(func, 2000);

        function func() {
            initializeVarsAgain();
            game();
        }
    }
}

//countdown method for new round
function playAgain() {
    var counter = 2;
    para.innerHTML = "New Round in 2 seconds.";
    var id;

    id = setInterval(function() {
        counter--;
        if (counter < 0) {

            return;
        } else {
            para.innerHTML = "New Round in " + counter.toString() + " seconds.";
        }
    }, 1000);
}

//sets all variables to initial values for new round
function initializeVarsAgain() {
    pX = canvas.width / 2 - 25;
    pY = 50;
    eX = canvas.width / 2 - 25;
    eY = 600;
    pDirection = "";
    eDirection = "";
    pSpeed = 15;
    bullet = [];
    bYp = 50 + 65;
    bXp = pX;
    bXe = eX;
    bYe = 600 - 50;
    bSpeedE = -30;
    bSpeedP = 30;
    copBLast = 0;
    WorL = "";
    crimeBLast = 0;
    gameDone = false;
    w.innerHTML = "";
    para.innerHTML = "";
}