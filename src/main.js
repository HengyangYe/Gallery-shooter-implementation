// main.js
"use strict";

const ScoreBoard = {
  level: 1,
  score: 0
}

const PlayerState = {
  health: 3
}
let config = {
  parent: 'phaser-game',
  type: Phaser.CANVAS,
  render: {
    pixelArt: true // prevent pixel art from getting blurred when scaled
  },
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: [Start, Invader, Invader2, Failed, Success],
  fps: {
    forceSetTimeOut: true,
    target: 120
  }
};

const game = new Phaser.Game(config);
