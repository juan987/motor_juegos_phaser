var width = 480;
var height = 320;
var game = new Phaser.Game(width, height, Phaser.AUTO, null, {preload: preload, create: create, update: update});
var player;
var food;
var cursors;
var speed = 175;
var score = 0;
var comidica=4;
var scoreText;

function preload() {
	game.stage.backgroundColor = '#eee';
	game.load.image('player', 'asset/red-square.png');
	game.load.image('food', 'asset/Pollo.png');
}
function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	cursors = game.input.keyboard.createCursorKeys();
	player = game.add.sprite(width*0.5, height*0.5, 'player');
	player.anchor.set(0.5);
	game.physics.enable(player);
	player.body.collideWorldBounds=true;
	
	food=game.add.group();
	food.create(width*0.1, height*0.1,'food');
	food.create(width*0.9, height*0.9,'food');
	food.create(width*0.1, height*0.9,'food');
	food.create(width*0.9, height*0.1,'food');
	for (var i in food.children){
		food.children[i].anchor.set(0.5);
	}
	game.physics.enable(food);
	scoreText=game.add.text(5,3,score);
}
function update() {
	if (cursors.up.isDown){
		player.body.velocity.y=-speed;
	}
	else if (cursors.down.isDown){
		player.body.velocity.y=speed;
	}
	else{
		player.body.velocity.y=0;
	}
	if (cursors.left.isDown){
		player.body.velocity.x=-speed;
	}
	else if (cursors.right.isDown){
		player.body.velocity.x=speed;
	}
	else{
		player.body.velocity.x=0;
	}
	game.physics.arcade.overlap(player,food,eatFood);
	if (comidica<=0){ 
		food.create(width*0.1, height*0.1,'food');
		food.create(width*0.9, height*0.9,'food');
		food.create(width*0.1, height*0.9,'food');
		food.create(width*0.9, height*0.1,'food');
		for (var i in food.children){
			food.children[i].anchor.set(0.5);
		}
		game.physics.enable(food);
		comidica=4;
	}
}

//eatFood function
function eatFood(player, food) {
	food.kill();
	score++;
	comidica--;
	scoreText.text=score;
}