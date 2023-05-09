// knapper til at vælge spil
let button;
let button2;

// Variabler til Pong
let Ly = 165;
let Ry = 165;
let Bally = 200,
  Ballx = 345,
  Balla = 4,
  Ballb = 4;
let Font;
let p1Score = 0;
let p2Score = 0;
let go = false;
let PaddleSound;
let ScoreSound;
let WallSound;
let spil = 0;

// Variabler til Slange
let slange;
let Skalering = 20;
let mad;

function preload() {
  Font = loadFont("Arcade.TTF");
  PaddleSound = loadSound("Paddle.mp3");
  ScoreSound = loadSound("Score.mp3");
  WallSound = loadSound("Wall.mp3");
}

function setup() {
  if (spil === 0) {
    createCanvas(700, 400);
    button = createButton("Pong");
    button.position(20, 20);
    button.mousePressed(skiftSpil_Pong);

    button2 = createButton("Snake");
    button2.position(90, 20);
    button2.mousePressed(skiftSpil_Snake);
  }
}

function skjulKnapper() {
  button.hide();
  button2.hide();
}

function draw() {
  if (spil === 0) {
    Start();
  }

  if (spil === 1) {
    Pong();
  }

  if (spil === 2) {
    background("grey");

    if (slange.Spise(mad)) {
      pickLocation();
    }
    slange.Død();
    slange.Opdater();
    slange.show();

    fill(255, 0, 100);
    rect(mad.x, mad.y, Skalering, Skalering);

    textSize(32);
    fill(255);
    textAlign(LEFT, TOP);
    text("Din score er: " + slange.total, 0, 0);
  }
}

function Start() {
  background(220);
  textAlign(CENTER);
  textSize(32);
  textFont("Georgia");
  fill(0, 150, 0);
  strokeWeight(1);
  text("Vælg hvilket spil du helst vil spille", width / 2, height / 2);
}
function skiftSpil_Pong() {
  skjulKnapper();
  frameRate(60);
  spil = 1;
}

function skiftSpil_Snake() {
  skjulKnapper();
  slange = new Slange();
  frameRate(width / Skalering / 2);
  pickLocation();
  spil = 2;
}

function paddleMove() {
  //Venstre paddel bevægelse
  if (keyIsDown(87) && spil === 1) {
    Ly -= 7;
  } else if (keyIsDown(83) && spil === 1) {
    Ly += 7;
  }

  //Højre paddel bevægelse
  if (keyIsDown(38) && spil === 1) {
    Ry -= 7;
  } else if (keyIsDown(40) && spil === 1) {
    Ry += 7;
  }
  //Stop venstre paddel ved toppen
  if (Ly < 0) {
    Ly = 0;
  }
  //Stop venstre paddle ved bunden
  else if (Ly > 400 - 70) {
    Ly = 400 - 70;
  }

  //Stop højre paddel ved toppen
  if (Ry < 0) {
    Ry = 0;
  }
  //Stop højre paddle ved bunden
  else if (Ry > 400 - 70) {
    Ry = 400 - 70;
  }
}

function ballMove() {
  //Bold bevægelse
  Ballx += Balla;
  Bally += Ballb;

  //Kollision med bunden
  if (Bally > 400 - 10) {
    Ballb = -Ballb;
    WallSound.play();
  }
  //Kollsion med toppen
  if (Bally < 10) {
    Ballb = -Ballb;
    WallSound.play();
  }
  //Højre mål kollision + score
  if (Ballx > 700) {
    Ballx = 345;
    Bally = 200;
    go = false;
    p1Score += 1;
    ScoreSound.play();
    Balla = 4;
  }
  //Venstre mål kollision + score
  if (Ballx < 0) {
    Ballx = 345;
    Bally = 200;
    go = false;
    p2Score += 1;
    ScoreSound.play();
    Balla = 4;
  }

  //Kollision mellem bold og venstre paddel
  if (Ballx < 25) {
    if (Bally > Ly && Bally < Ly + 70) {
      Balla = -Balla + 1;
      PaddleSound.play();
    }
  }
  //Kollision mellem bold og højre paddel
  if (Ballx > 675 - 10)
    if (Bally > Ry && Bally < Ry + 70) {
      Balla = -Balla - 1;
      PaddleSound.play();
    }
}

function Pong() {
  paddleMove();

  if (keyIsDown(32)) {
    go = true;
  }
  if (go) {
    ballMove();
  }

  background(52);

  //Venstre paddle
  stroke(195, 195, 195);
  fill(195, 195, 195);
  rect(10, Ly, 10, 70);

  //Højre paddle
  rect(680, Ry, 10, 70);

  //Bold
  rect(Ballx, Bally, 10, 10);

  //Score visning
  textFont(Font);
  textSize(100);
  text(p1Score, width / 4 - 30, 100);
  text(p2Score, (width / 4) * 3, 100);

  //Linje i midten
  strokeWeight(4);
  stroke(195, 195, 195);
  line(width / 2, 0, width / 2, height);

  //Reset spil
  if (keyIsDown(82)) {
    p1Score = 0;
    p2Score = 0;
    Bally = 200;
    Ballx = 345;
    go = false;
  }
}

function pickLocation() {
  var Kolonner = floor(width / Skalering);
  var Rækker = floor(height / Skalering);
  mad = createVector(floor(random(Kolonner)), floor(random(Rækker)));
  mad.mult(Skalering);
}

function keyPressed() {
  if (spil === 2) {
    if (keyCode === UP_ARROW && slange.yspeed !== 1) {
      slange.retning(0, -1);
    } else if (keyCode === DOWN_ARROW && slange.yspeed !== -1) {
      slange.retning(0, 1);
    } else if (keyCode === RIGHT_ARROW && slange.xspeed !== -1) {
      slange.retning(1, 0);
    } else if (keyCode === LEFT_ARROW && slange.xspeed !== 1) {
      slange.retning(-1, 0);
    }
  }
}

class Slange {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.xspeed = 1;
    this.yspeed = 0;
    this.total = 0;
    this.Hale = [];
    this.score = 0;
  }

  Spise(pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      this.score = this.score + 1;
      return true;
    } else {
      return false;
    }
  }

  Retning(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  Død() {
    for (var i = 0; i < this.Hale.length; i++) {
      var pos = this.Hale[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        console.log("Prøv igen, din score var " + this.total);
        this.total = 0;
        this.Hale = [];
      }
    }
  }

  Opdater() {
    for (var i = 0; i < this.Hale.length - 1; i++) {
      this.Hale[i] = this.Hale[i + 1];
    }
    if (this.total >= 1) {
      this.Hale[this.total - 1] = createVector(this.x, this.y);
    }

    this.x = this.x + this.xspeed * Skalering;
    this.y = this.y + this.yspeed * Skalering;

    this.x = constrain(this.x, 0, width - Skalering);
    this.y = constrain(this.y, 0, height - Skalering);
  }

  show() {
    fill("rgb(0,255,0)");
    for (var i = 0; i < this.Hale.length; i++) {
      rect(this.Hale[i].x, this.Hale[i].y, Skalering, Skalering);
    }
    rect(this.x, this.y, Skalering, Skalering);
  }
  retning(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }
}
