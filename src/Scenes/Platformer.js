class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    create() {
        // Load the tilemap
        this.map = this.add.tilemap("map");
        this.tileset = this.map.addTilesetImage("tiny-town-packed", "tiny_town_tiles");
        this.grassLayer = this.map.createLayer("Grass-n-Houses", this.tileset, 0, 0);
        this.grassLayer.setScale(4);
    
        // Define tile size (scaled)
        this.TILE_SIZE = 16 * 4; // Original tile size * scale
    
        // Add player sprite, aligned to the center of a tile
        this.player = this.add.sprite(
            this.TILE_SIZE * 5 + this.TILE_SIZE / 2, // Starting tile (column 5, centered)
            this.TILE_SIZE * 5 + this.TILE_SIZE / 2, // Starting tile (row 5, centered)
            "platformer_characters",
            "tile_0000.png"
        ).setScale(SCALE);
    
        // Add keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
    
        // Track movement state
        this.isMoving = false; // Prevent multiple inputs at the same time
    }
    
    update() {
        // Ensure only one movement at a time
        if (!this.isMoving) {
            if (this.cursors.left.isDown) {
                this.isMoving = true;
                this.movePlayer(-1, 0); // Move left
            } else if (this.cursors.right.isDown) {
                this.isMoving = true;
                this.movePlayer(1, 0); // Move right
            } else if (this.cursors.up.isDown) {
                this.isMoving = true;
                this.movePlayer(0, -1); // Move up
            } else if (this.cursors.down.isDown) {
                this.isMoving = true;
                this.movePlayer(0, 1); // Move down
            }
        }
    }
    
    // Function to move the player
    movePlayer(deltaX, deltaY) {
        // Calculate new position
        const newX = this.player.x + deltaX * this.TILE_SIZE;
        const newY = this.player.y + deltaY * this.TILE_SIZE;
    
        // Get canvas dimensions
        const canvasWidth = game.config.width;
        const canvasHeight = game.config.height;
    
        // Boundary checks
        const halfTile = this.TILE_SIZE / 2;
        if (
            newX - halfTile < 0 || // Left boundary
            newX + halfTile > canvasWidth || // Right boundary
            newY - halfTile < 0 || // Top boundary
            newY + halfTile > canvasHeight // Bottom boundary
        ) {
            // If out of bounds, do nothing
            this.isMoving = false;
            return;
        }
    
        // Move player to new position (centered on tile)
        this.tweens.add({
            targets: this.player,
            x: newX,
            y: newY,
            duration: 200, // Smooth movement
            onComplete: () => {
                this.isMoving = false; // Allow next movement
            },
        });
    }
    
    

    
}