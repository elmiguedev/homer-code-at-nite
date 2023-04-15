import { Scene } from "phaser";

export class Homer extends Phaser.GameObjects.Sprite {
  private spriteTimer!: Phaser.Time.TimerEvent;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "homer_coding");
    this.scene.add.existing(this);
    this.setScale(12);
  }

  setHappy() {
    this.setTexture("homer_ok");
  }

  setAngry() {
    this.setTexture("homer_bad");
  }

  setCoding() {
    this.setTexture("homer_coding");
  }

  happy() {
    this.setHappy();
    if (this.spriteTimer) this.spriteTimer.remove;
    this.spriteTimer = this.scene.time.addEvent({
      delay: 500,
      callback: () => {
        this.setCoding();
      }
    })
  }

  angry() {
    if (this.spriteTimer) this.spriteTimer.remove;
    this.setAngry();
    this.spriteTimer = this.scene.time.addEvent({
      delay: 500,
      callback: () => {
        this.setCoding();
      }
    })
  }

}