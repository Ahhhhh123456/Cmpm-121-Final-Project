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
        // Randomly generate incoming sun and water (values between 0 and 10)
        const incomingSun = Math.floor(Math.random() * 11);
        const incomingWater = Math.floor(Math.random() * 11);

        // Update sun and water levels
        this.sunLevel = incomingSun;
        this.waterLevel += incomingWater;

        // Update growth level based on sun and water levels
        this.updateGrowthLevel();

        // Log the current state of the tile
        console.log(
            `Tile updated - Sun: ${this.sunLevel}, Water: ${this.waterLevel}, Plant: ${this.plantType}, Growth: ${this.growthLevel}`
        );
    }

    // Pass neighboring tiles to evaluate growth conditions
    updateGrowthLevel(neighbors) {
        const neighboringPlants = neighbors.filter(
            (neighbor) => neighbor.plantType !== null
        ).length;

        // Example growth conditions
        if (
            this.sunLevel > 5 &&
            this.waterLevel > 5 &&
            neighboringPlants >= 2
        ) {
            this.growthLevel = Math.min(this.growthLevel + 1, 3); // Max level 3
        }
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
        this.TILE_SIZE = 16 * 4;

        // Add player sprite
        this.player = this.add.sprite(
            this.TILE_SIZE * 5 + this.TILE_SIZE / 2,
            this.TILE_SIZE * 5 + this.TILE_SIZE / 2,
            "platformer_characters",
            "tile_0000.png"
        ).setScale(SCALE);

        // Add keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Movement state
        this.isMoving = false;

        // Move counter
        this.moveCount = 0;

        // Create a grid of Tile objects and corresponding tile indices
        this.grid = [];
        this.rows = this.map.height;
        this.cols = this.map.width;

        for (let row = 0; row < this.rows; row++) {
            const gridRow = [];
            for (let col = 0; col < this.cols; col++) {
                gridRow.push(new Tile());
            }
            this.grid.push(gridRow);
        }

        // Randomize all inner tiles initially
        this.randomizeInnerTiles();
    }

    randomizeInnerTiles() {
        const tileOptions = [3, 26]; // Example: grass (3) and flower (26)

        for (let row = 1; row < this.rows - 1; row++) {
            for (let col = 1; col < this.cols - 1; col++) {
                const randomTileIndex = tileOptions[Math.floor(Math.random() * tileOptions.length)];
                this.map.putTileAt(randomTileIndex, col, row, this.grassLayer);

                // Reflect in the grid as well
                if (randomTileIndex === 26) {
                    this.grid[row][col].growthLevel = 2; // Flowers start with growth level 2
                }
            }
        }
    }

    generateFlowerTile() {
        const flowerTileIndex = 3;
        const randomRow = Phaser.Math.Between(1, this.rows - 2);
        const randomCol = Phaser.Math.Between(1, this.cols - 2);

        this.map.putTileAt(flowerTileIndex, randomCol, randomRow, this.grassLayer);
        this.grid[randomRow][randomCol].growthLevel = 2; // Set flower growth level
    }

    movePlayer(deltaX, deltaY) {
        const newX = this.player.x + deltaX * this.TILE_SIZE;
        const newY = this.player.y + deltaY * this.TILE_SIZE;

        const canvasWidth = game.config.width;
        const canvasHeight = game.config.height;
        const halfTile = this.TILE_SIZE / 2;

        if (
            newX - halfTile < 0 ||
            newX + halfTile > canvasWidth ||
            newY - halfTile < 0 ||
            newY + halfTile > canvasHeight
        ) {
            this.isMoving = false;
            return;
        }

        this.tweens.add({
            targets: this.player,
            x: newX,
            y: newY,
            duration: 200,
            onComplete: () => {
                this.isMoving = false;
            },
        });

        this.moveCount++;

        // After 3 moves, generate a flower tile
        if (this.moveCount >= 3) {
            this.generateFlowerTile();
            this.moveCount = 0;
        }

    // Utility to find neighboring tiles
    getNeighbors(row, col); {
        const neighbors = [];
        const directions = [
            [-1, 0], // up
            [1, 0], // down
            [0, -1], // left
            [0, 1], // right
        ];

        directions.forEach(([dRow, dCol]) => {
            const nRow = row + dRow;
            const nCol = col + dCol;
            if (
                nRow >= 0 &&
                nRow < this.rows &&
                nCol >= 0 &&
                nCol < this.cols
            ) {
                neighbors.push(this.grid[nRow][nCol]);
            }
        });
    return neighbors;
    }
}

    update() {
        if (!this.isMoving) {
            if (this.cursors.left.isDown) {
                this.isMoving = true;
                this.movePlayer(-1, 0);
                this.player.setFlipX(false);
            } else if (this.cursors.right.isDown) {
                this.isMoving = true;
                this.movePlayer(1, 0);
                this.player.setFlipX(true);
            } else if (this.cursors.up.isDown) {
                this.isMoving = true;
                this.movePlayer(0, -1);
            } else if (this.cursors.down.isDown) {
                this.isMoving = true;
                this.movePlayer(0, 1);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            const playerTileX = Math.floor(this.player.x / this.TILE_SIZE);
            const playerTileY = Math.floor(this.player.y / this.TILE_SIZE);

            const tile = this.map.getTileAt(playerTileX, playerTileY, this.grassLayer);

            if (tile && tile.index === 3) {
                // Reap flower
                this.map.putTileAt(26, playerTileX, playerTileY, this.grassLayer);
                console.log("Flower reaped!");
            }
        }

        // Update sun and water levels for each tile
        this.grid.forEach((row) => row.forEach((tile) => tile.updateLevels()));

        // Check completion conditions
        if (this.checkWinCondition()) {
            console.log("You win!");
        // Optionally: Restart game or proceed to the next level
        }

        // neighboring tile evaluation
        this.grid.forEach((row, rowIndex) =>
            row.forEach((tile, colIndex) => {
                const neighbors = this.getNeighbors(rowIndex, colIndex);
                tile.updateLevels();
                tile.updateGrowthLevel(neighbors);
            })
        );
        // Win condition: At least 5 plants at growth level 3
        checkWinCondition(); {
            let highLevelPlants = 0;

            this.grid.forEach((row) =>
                row.forEach((tile) => {
                    if (tile.growthLevel === 3) {
                        highLevelPlants++;
                    }
                })
            );

            return highLevelPlants >= 5;
        }
    }
}