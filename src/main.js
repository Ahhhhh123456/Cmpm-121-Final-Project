"use strict";

// Game config
let config = {
  parent: "phaser-game",
  type: Phaser.CANVAS,
  render: {
    pixelArt: true, // Prevent pixel art from getting blurred when scaled
  },
  width: 640,
  height: 640,
  scene: [Load, Platformer], // Load and Platformer scenes
};

var cursors;
const SCALE = 2.0;
var my = { sprite: {}, text: {}, vfx: {} };

// Create the Phaser game instance
const game = new Phaser.Game(config);

// Load events YAML when the game starts
function loadEvents() {
  fetch('assets/events.yaml')  // Change the file path to events.yaml
    .then(response => response.text())  // Get the raw YAML as text
    .then(yamlText => {
      try {
        // Parse YAML text into a JavaScript object
        const data = jsyaml.load(yamlText);
        // Handle events when they're loaded
        handleEvents(data.events);  // Adjusted to handle 'events' key in YAML
      } catch (error) {
        console.error('Error parsing YAML:', error);
      }
    })
    .catch(error => console.error('Error loading events:', error));
}

// Handle events based on the YAML data
function handleEvents(events) {
  events.forEach(event => {
    console.log(`Event: ${event.event}, Time: ${event.time}, Action: ${event.action}`);
    
    // Handle different events
    if (event.event === "Grow plants") {
      setTimeout(() => {
        console.log("Growing plants!");
        // Implement plant growth logic
      }, event.time * 1000); // Time in seconds
    }

    if (event.event === "Generate flower") {
      setTimeout(() => {
        console.log("Generating a new flower!");
        // Implement flower generation logic
      }, event.time * 1000);
    }

    if (event.event === "Increase water level") {
      setTimeout(() => {
        console.log("Increasing water level by 2!");
        // Implement water level increase logic
      }, event.time * 1000);
    }
  });
}

// Load events when the game is ready
loadEvents();
