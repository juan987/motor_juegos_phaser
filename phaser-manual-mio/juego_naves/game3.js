//set width and height variables for game
var width = 800;
var height = 600;
//create game object and initialize the canvas
var game = new Phaser.Game(width, height, Phaser.AUTO, null, {preload: preload, create: create, update: update});

function preload() {

    game.load.image('bullet', 'asset/bullet25.png');
    game.load.image('ship', 'asset/viper.png');
    game.load.image('ufo', 'asset/ufo.png');

}

var sprite;
var weapon;
var weapon2;
var cursors;
var fireButton;
var ufo;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //  Creates 30 bullets, using the 'bullet' graphic
    weapon = game.add.weapon(30, 'bullet');
    weapon2 = game.add.weapon(30, 'bullet');

    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    weapon2.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  Because our bullet is drawn facing up, we need to offset its rotation:
    weapon.bulletAngleOffset = 90;
    weapon2.bulletAngleOffset = 90;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 400;
    weapon2.bulletSpeed = 400;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 60;
    weapon2.fireRate = 60;

    //  Add a variance to the bullet speed by +- this value
    weapon.bulletSpeedVariance = 200;
    weapon2.bulletSpeedVariance = 200;

    sprite = this.add.sprite(440, 660, 'ship');

    game.physics.arcade.enable(sprite);
    game.physics.arcade.enable(weapon);
    game.physics.arcade.enable(weapon2);

    //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    weapon.trackSprite(sprite, 30, 0);
    weapon2.trackSprite(sprite, 92, 4);

   game.physics.enable(weapon, Phaser.Physics.ARCADE);
   game.physics.enable(weapon2, Phaser.Physics.ARCADE);
      
    cursors = this.input.keyboard.createCursorKeys();

    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);



    //UFOS
	ufo = game.add.physicsGroup();
	var ufo1 = ufo.create(300, 0, 'ufo');
	var ufo2 = ufo.create(100, 50, 'ufo');
	var ufo3 = ufo.create(0, 100, 'ufo');
	var ufo4 = ufo.create(200, 150, 'ufo');
	ufo1.body.velocity.x = this.rnd.between(250, 500);
	ufo2.body.velocity.x = -this.rnd.between(200, 450);
	ufo3.body.velocity.x = -this.rnd.between(50, 150);
	ufo4.body.velocity.x = -this.rnd.between(500, 550);
	ufo.setAll('body.allowGravity', false);
/*   game.physics.arcade.enable(ufo); */
game.physics.enable(ufo, Phaser.Physics.ARCADE); 

}


function update() {

    sprite.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -200;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 200;
    }

    if (fireButton.isDown)
    {
        weapon.fire();
        weapon2.fire();
    }


ufo.forEach(function (ufos){
		            if (ufos.body.velocity.x < 0 && ufos.x <= -160)
            {
                ufos.x = 800;
            }
            else if (ufos.body.velocity.x > 0 && ufos.x >= 800)
            {
                ufos.x = -160;
            }
	});


game.physics.arcade.overlap(weapon2.bullets, ufo, atacarUfo);

game.physics.arcade.overlap(weapon.bullets, ufo, atacarUfo);

}

function render() {

    weapon.debug();
    weapon2.debug();

}


function atacarUfo(weapon2, ufo){
  //remove the piece of food
	ufo.kill();
    weapon2.kill();
	//update the score


}
