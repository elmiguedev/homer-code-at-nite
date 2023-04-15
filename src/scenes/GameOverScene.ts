import { Scene } from "phaser";

export class GameOverScene extends Scene {

  private restartKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super("GameOverScene")
  }

  create() {
    this.add.text(300, 300, "PERDISTE");
    this.restartKey = this.input.keyboard.addKey("ENTER");
    this.restartKey.onDown = () => {
      this.scene.start("MainScene")
    }
  }
}