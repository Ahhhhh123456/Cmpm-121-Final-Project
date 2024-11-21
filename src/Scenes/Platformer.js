class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    create() {
        // Load the tilemap
        this.map = this.add.tilemap("map");
    
        // Add the tileset (ensure the first parameter matches the tileset name in the JSON)
        this.tileset = this.map.addTilesetImage("tiny-town-packed", "tiny_town_tiles");
    
        // Create the layer (ensure the layer name matches the JSON)
        this.grassLayer = this.map.createLayer("Grass-n-Houses", this.tileset, 0, 0);

        this.grassLayer.setScale(4);

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height/2, "platformer_characters", "tile_0000.png").setScale(SCALE);
        
        cursors = this.input.keyboard.createCursorKeys();
    }
    

    // Never get here since a new scene is started in create()
    update() {

        if (cursors.left.isDown){
            my.sprite.player.flipX = false;
            my.sprite.player.x -= 2;
            my.sprite.player.anims.play('walk', true);
            console.log(my.sprite.player.x);
        }
        if (cursors.right.isDown){
            my.sprite.player.flipX = true;
            my.sprite.player.x += 2;
            my.sprite.player.anims.play('walk', true);
            console.log(my.sprite.player.x);
        }
        if (cursors.up.isDown){
            my.sprite.player.y -= 2;
            my.sprite.player.anims.play('walk', true);
            console.log(my.sprite.player.y);
        }
        if (cursors.down.isDown){
            my.sprite.player.y += 2;
            my.sprite.player.anims.play('walk', true);
            console.log(my.sprite.player.y);
        }

        if (cursors.left.isUp && cursors.right.isUp && cursors.up.isUp && cursors.down.isUp){
            my.sprite.player.anims.play('idle', true);
        }
        

    }
}