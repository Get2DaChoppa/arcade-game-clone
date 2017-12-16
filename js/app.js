// Enemies our player must avoid
let Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};


Enemy.prototype = {
    // Updates the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update : function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
        this.x += this.speed * dt;
        if (this.x >= 605) {
            this.x = getRandomInt(-101,-250);
            this.speed = (getRandomInt(difficulty*20,(difficulty+3)*20)+50);
        }
        this.checkCollision(this);
    },

    // Draws the enemy on the screen, required method for game
    render : function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },

    // checks for collision between enemy and player
    checkCollision : function(){
        if (player.y + 131 >= this.y + 90 &&
            player.x + 25 <= this.x + 88 &&
            player.y + 73 <= this.y + 135 &&
            player.x + 76 >= this.x + 11) {
            player.x = 202;
            player.y = 404;
            lives = lives - 1;
            livesUpdate(lives);
            if(lives===0){
                gameOver();
            }
        }
    }
};

// Player class constructor function
let Player = function(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
};

Player.prototype = {
    // Initializes player's position
    init : function() {
        this.x = 202 ;
        this.y = 404 ;
    },
    // Draws the player on the screen, required method for game
    render : function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },
    // Adds points collected by gem or round winning
    addPoints : function(bonus) {
        points = points+bonus;
        document.getElementById('points').innerHTML = points;
    },
    // Handles keys pressed by user
    handleInput : function(pressedKey) {
        if(pressedKey === 'left' && this.x>0) {
            this.x = this.x - 101;
        }else if(pressedKey === 'up' && this.y>0) {
            this.y = this.y - 83;
        }else if(pressedKey === 'right' && this.x<404) {
            this.x = this.x + 101;
        }else if(pressedKey === 'down' && this.y<404) {
            this.y = this.y + 83;
        }
        if(this.y<50){
            this.addPoints(100);
            this.init();
            roundUpdate();
            difficulty++;
            seconds = 30;
        }
    },
    // Checks for collision between player and gem
    checkCollision : function(player){
        if (player.y + 131 >= gem.y + 90 &&
            player.x + 25 <= gem.x + 88 &&
            player.y + 73 <= gem.y + 135 &&
            player.x + 76 >= gem.x + 11) {
            gem = new Gem(getRandomInt(0,4)*101,getRandomInt(1,5)*83-18,getRandomInt(0,3));
            player.addPoints(gem.points);
        }
    },
    // Calls the actions needed to check in every player move
    update : function() {
        player.checkCollision(this);
    }
};

// Gem class constructor function
let Gem = function(x,y,color) {
    this.x = x;
    this.y = y;
    this.sprite = allGems[color].sprite;
    this.points = allGems[color].points;
};

Gem.prototype = {
    // Renders Gem objects on the canvas
    render : function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// initializes all variables and objects needed to start the game
let gameStart = function() {
    allGems =[
        blue = {
            sprite : 'images/gem-blue.png',
            points : 20
        },
        orange = {
            sprite : 'images/gem-orange.png',
            points : 30
        },
        green = {
            sprite : 'images/gem-green.png',
            points : 40
        }
    ],
    round = 0,
    allEnemies = [],
    lives = 3,
    seconds = 30,
    points = 0,
    difficulty = 1,
    gem = new Gem(getRandomInt(0,4)*101,getRandomInt(1,5)*83-18,getRandomInt(0,3));
    player = new Player(202,404);
    player.addPoints(0);
    livesUpdate(lives);
    roundUpdate();
    for (var i = 0; i < 3; i++) {
        enemiesInit(i);
    };
}

gameStart();

// Place all enemy objects in an array called allEnemies
function enemiesInit(i) {
    setTimeout(function() {
        let enemy = new Enemy(getRandomInt(-100,-300), (i+1)*83 -18, getRandomInt(difficulty*20,(difficulty+3)*20)+50);
        allEnemies.push(enemy);
    }, 600);
}

// Update remaining player lives
function livesUpdate(num){
    document.getElementById('lives').innerHTML = "";
    for (var i = 0; i < num; i++) {
        document.getElementById('lives').innerHTML += '<i class="fas fa-heart"></i>' ;
    }
}

// Set round timer
let timer = setInterval(function() {
    document.getElementById('time').innerHTML = seconds;
    seconds--;
    if(seconds === 0) {
        gameOver();
    }
},1000);

// Update current round
function roundUpdate (){
    round++;
    document.getElementById('round').innerHTML = round;
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Get a random integer between two values
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Stops the game when no lives remain or the time is up
function gameOver() {
    modal("Game Over","fas fa-gamepad");
}

// Creates a modal
// msg represents the modal's header message
// icon is a font awesome class
function modal(msg , icon) {
    $("canvas").html("");
    $(".modal").find(".icon").html('<i class="fa '+icon+'"></i>');
    $(".modal").find("h3").html(msg);
    $(".modal").find("h5").html("You won "+points+" points!");
    $(".overlay").addClass("is-open");
}

// Onclick function for modals Play again button
$(".play-again").click(function(){
        gameStart();
    $(".overlay").removeClass("is-open");
});


