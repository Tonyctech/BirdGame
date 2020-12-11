var config = {
  type: Phaser.AUTO,

  width: 1800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {},
  },
  scene: {
    key: "main",
    preload: preload,
    create: create,
    update: update,
  },
};
var onPlatform = false;
var player;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  this.load.image("red", "assets/particles/red.png");
  this.load.image("ground", "assets/platform.png");
  this.load.spritesheet("bird", "assets/bird3.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
}

function create() {
  this.add.image(400, 300, "sky");
  this.add.image(1200, 300, "sky");
  this.add.image(1600, 300, "sky");
  var particles = this.add.particles("red");
  platforms = this.physics.add.staticGroup();
  var emitter = particles.createEmitter({
    speed: 1,
    scale: { start: 1, end: 0 },
    blendMode: "ADD",
  });

  let bg = this.add.sprite(0, 0, "background");
  bg.setPosition(1200 / 2, 800 / 2);
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;

  console.log(gameW, gameH);
  console.log(bg);
  console.log(this);
  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#000",
  });
  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms.create(400, 568, "ground").setScale(2).refreshBody();
  platforms.create(1200, 568, "ground").setScale(2).refreshBody();
  platforms.create(1600, 568, "ground").setScale(2).refreshBody();

  // The player and its settings
  platforms.create(750, 220, "ground"); // Top right platform
  platforms.create(140, 250, "ground"); // top left platform
  platforms.create(600, 400, "ground"); // lower platform

  // The player and its settings
  player = this.physics.add.sprite(100, 450, "bird");
  // player = this.physics.add.sprite(100, 450, "dude2");
  // To Do: Trigger for walk animation

  //  Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0.2);

  player.setCollideWorldBounds(true);
  this.cameras.main.setBackgroundColor("#ccccff");

  // Follows up and down, but not L or R
  this.cameras.main.setBounds(-20, -20, 500, 630);
  this.cameras.main.startFollow(player);
  //  Our player animations, turning, walking left and walking right.
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("bird", {
      start: 0,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "bird", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("bird", {
      start: 5,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  });
  // this.anims.create({
  //   key: "Gright",
  //   frames: this.anims.generateFrameNumbers("bird", {
  //     start: 5,
  //     end: 8,
  //   }),
  //   frameRate: 10,
  //   repeat: -1,
  // });

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();

  var star = this.physics.add.image(400, 100, "star");

  star.setVelocity(100, 200);
  star.setBounce(1, 1);
  star.setCollideWorldBounds(true);

  emitter.startFollow(star);
  this.physics.add.collider(player, platforms, function () {
    onPlatform = true;
  });
  this.physics.add.collider(star, platforms);
  this.physics.add.collider(player, star);
}
function update() {
  player.setVelocity(0);

  if (gameOver) {
    return;
  }
  if (cursors.left.isDown) {
    player.setVelocityX(-260);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(260);
    player.anims.play("right", true);
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-260);
  } else if (cursors.down.isDown) {
    player.setVelocityY(260);
  }
}
function print() {
  scoreText.setText("--- ON PLATFORM ---");
}
