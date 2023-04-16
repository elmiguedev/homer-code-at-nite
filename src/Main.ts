import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';
import { StartScene } from './scenes/StartScene';
import { GameOverScene } from './scenes/GameOverScene';
import { LoadingScene } from './scenes/LoadingScene';
import { InstructionsScene } from './scenes/InstructionsScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  render: {
    pixelArt: true
  },
  scene: [
    LoadingScene,
    StartScene,
    InstructionsScene,
    MainScene,
    GameOverScene
  ]
};

new Phaser.Game(config);