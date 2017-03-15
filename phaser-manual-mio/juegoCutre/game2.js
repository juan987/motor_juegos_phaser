//set width and height variables for game
var width = 800;
var height = 600;
//create game object and initialize the canvas
var game = new Phaser.Game(width, height, Phaser.AUTO, null, {preload: preload, create: create, update: update});

//initialize some variables
var player;
var koopas;
var cursors;
var speed = 450;
var horizontalSpeed = 80;
var score = 0;
var scoreText;
var spaceKey;
var izquierda;
var derecha;
var maximoKoopas=4;
var koopasActuales=0;
var fechaUltimoKoopa = new Date();
var platforms;
var allowToJump=true;
//var koopaActual=0;
//var arrayKoopas=[];

function preload() {


	//load assets
	//game.load.image('player', 'asset/character-color.png');
	game.load.spritesheet('player', 'asset/dude.png', 32, 48);
	game.load.image('koopa', 'asset/18890.png');
	game.load.image('clouds', 'asset/clouds.png');
	game.load.image('trees', 'asset/trees.png');
	game.load.image('platform', 'asset/platform.png');
    game.load.image('ice-platform', 'asset/ice-platform.png');
	
//	game.load.image('food', 'asset/Pollo.png');
}
function create() {
	//fondo
	game.stage.backgroundColor = '#2f9acc';
	game.sky = this.add.tileSprite(0, 0, 800, 600, 'clouds');
    game.sky.fixedToCamera = true;
	game.add.sprite(0, 510, 'trees');
	
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.gravity.y = 300;  
	//cursors = game.input.keyboard.createCursorKeys();
	spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	izquierda = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	derecha = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR,
		Phaser.Keyboard.LEFT,
		Phaser.Keyboard.RIGHT ]);
		
	//add player sprite
	player = game.add.sprite(0, height*1, 'player');
	//player.scale.setTo(0.5,0.5);
	game.physics.enable(player);
	player.body.setSize(20, 32, 5, 16);
 	player.anchor.set(0.5);
	player.body.collideWorldBounds = true;
	
	koopas=game.add.group();
	//solo si ponemos las animaciones
	player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
	//this.camera.follow(this.player);  no vamos a usarlo
	
	scoreText = game.add.text(5, 3, score);
	
	//las plataformas
	platforms = game.add.physicsGroup();
	var platform1 = platforms.create(0, 400, 'platform');
	var platform2 = platforms.create(200, 200, 'ice-platform');
	platform1.body.velocity.x = this.rnd.between(100, 150);
	platform2.body.velocity.x = -this.rnd.between(100, 150);
	platforms.setAll('body.allowGravity', false);
    platforms.setAll('body.immovable', true);
}
function update() {

	//move the player up and down based on keyboard arrows
	if (player.body.onFloor()){allowToJump=true;}
	if (spaceKey.isDown) {
		if (allowToJump)
		{
		player.body.velocity.y = -speed;
		allowToJump=false}
	} 
	if (izquierda.isDown) {
		player.body.velocity.x = -horizontalSpeed;
		player.play('left');
	}
	else if (derecha.isDown) {
		player.body.velocity.x = horizontalSpeed;
		player.play('right');
	}
	else{
		//congelamos animación
		if (player.body.velocity.x<0){player.frame = 0;}
		else {player.frame = 5;}
		
		player.body.velocity.x=0;
	}
	if (maximoKoopas>koopasActuales){
		var currentDate=new Date();
		if (currentDate.getTime() > (fechaUltimoKoopa.getTime()+3000)){
			fechaUltimoKoopa=currentDate;
			koopas.create(width*1, height*1, 'koopa');
			koopas.children[koopas.children.length-1].anchor.set(1);
			game.physics.enable(koopas.children[koopas.children.length-1], Phaser.Physics.ARCADE);
			koopas.children[koopas.children.length-1].body.velocity.x=-50;
			koopas.children[koopas.children.length-1].body.collideWorldBounds = false;
			koopas.children[koopas.children.length-1].body.allowGravity=false;
			koopasActuales++;
		}
	}
	game.physics.arcade.overlap(player, koopas, investigaHit);
	
	koopas.forEach(function (koopaActual){
		    if (koopaActual.x <= -100)
            {
                koopaActual.kill();
				koopasActuales--;
            }
	});
	
	//para cada plataforma miro si se tienen que ir
	platforms.forEach(function (plataforma){
		            if (plataforma.body.velocity.x < 0 && plataforma.x <= -160)
            {
                plataforma.x = 800;
            }
            else if (plataforma.body.velocity.x > 0 && plataforma.x >= 800)
            {
                plataforma.x = -160;
            }
	});
	
	game.physics.arcade.collide(player, platforms,function(player,platform){allowToJump=true;}, null, game);

}

function investigaHit(player, koopas) {
	if (player.body.touching.down)
	{
		koopas.kill();
		//update the score
		score++;
		koopasActuales--;
		scoreText.text = score;
	}
	else if (player.body.touching.left||player.body.touching.right){
		//pues se muere, 10 puntos menos
		koopas.kill();
		//update the score
		score-=10;
		koopasActuales--;
		scoreText.text = score; 
	}
}