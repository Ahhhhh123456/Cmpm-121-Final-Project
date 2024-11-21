class Tile {
    constructor() {
        this.sunLevel = 0;
        this.waterLevel = 0;
        this.plantType = this.getRandomPlantType();
        this.growthLevel = 1; // Starting growth level
    }

    getRandomPlantType() {
        const plantTypes = ["species1", "species2", "species3"];
        return plantTypes[Math.floor(Math.random() * plantTypes.length)];
    }

    updateLevels() {
        // Randomly generate incoming sun and water (values between 0 and 10 for example)
        const incomingSun = Math.floor(Math.random() * 11);
        const incomingWater = Math.floor(Math.random() * 11);

        // Update sun level (use immediately or lose)
        this.sunLevel = incomingSun;

        // Update water level (accumulate over turns)
        this.waterLevel += incomingWater;

        // Log the updated sun and water levels
        console.log(`Tile updated - Sun: ${this.sunLevel}, Water: ${this.waterLevel}`);

        // Update growth level based on sun and water levels
        this.updateGrowthLevel();
    }

    updateGrowthLevel() {
        // Example logic to update growth level
        if (this.sunLevel > 5 && this.waterLevel > 5) {
            this.growthLevel = Math.min(this.growthLevel + 1, 3); // Max growth level is 3
        }

        // Log the updated growth level
        console.log(`Plant type: ${this.plantType}, Growth level: ${this.growthLevel}`);
    }
}

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

        // Create a grid of Tile objects
        this.grid = [];
        for (let i = 0; i < this.map.height; i++) {
            const row = [];
            for (let j = 0; j < this.map.width; j++) {
                row.push(new Tile());
            }
            this.grid.push(row);
        }
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

        // Update sun and water levels for each tile
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                this.grid[i][j].updateLevels();
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