import { Scene } from "phaser";

export class Code {

  private CODES = [
    'console.log();',
    'let a = 5;',
    'const b = 2;',
    'if (a > b) {}',
    'const arr = [1,2,3];',
    'let i = 0;',
    'const num = 3.14;',
    'let x;',
    'let y = null;',
    'let z = undefined;',
    'const str = "hello";',
    'const bool = true;',
    'const date = new Date();',
    'const arr = ["red"];',
    'let i = arr.indexOf("green");',
    'const result = 10;',
    'const random = Math.random();',
    'let y = null;',
    'let z = undefined;',
    'const str = "hello";',
    'const bool = true;',
    'const date = new Date();',
    'a++;',
    'b--;',
    'x += 2;',
    'y -= 3;',
    'const max = 100;',
    'const min = -100;',
    'const sum = (a, b) => a + b;',
    'const len = arr.length;',
    'const last = arr.pop();',
    'const str = "hello";',
  ];


  private scene!: Scene;
  private x!: number;
  private y!: number;
  private timerEnabled!: boolean;

  private code: string;
  private selectedCode: string;
  private currentCharIndex: number;
  private codeTimerDuration: number = 7000;
  private codeTimerDurationSpeedUp: number = 0;

  private txtSelectedCode!: Phaser.GameObjects.Text;
  private txtGameCode!: Phaser.GameObjects.Text;
  private codeTimerLine!: Phaser.GameObjects.Rectangle;
  private codeTimerTween!: Phaser.Tweens.Tween;
  private successTick!: Phaser.GameObjects.Sprite;
  private successTickTween!: Phaser.Tweens.Tween;

  private keyboardSound!: Phaser.Sound.BaseSound;

  public onSaveCode!: Function;
  public onBreakCode!: Function;

  constructor(scene: Scene, x: number, y: number, timerEnabled?: boolean) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.code = "";
    this.selectedCode = "";
    this.currentCharIndex = 0;
    this.timerEnabled = timerEnabled || false;


    this.create();
  }

  private create() {
    this.createKeyboardSound();
    this.createCode();
    this.createSuccessTick();

    if (this.timerEnabled)
      this.createTimer();

    this.selectCode();
  }

  private createKeyboardSound() {
    this.keyboardSound = this.scene.sound.add("keyboard");
  }

  private createCode() {
    this.txtSelectedCode = this.scene.add.text(this.x, this.y, "", {
      fontSize: "64px",
      backgroundColor: 'white',
      color: 'black',
      fontStyle: 'bold',
      padding: {
        x: 16,
        y: 16
      }
    }).setOrigin(0.5);
    this.txtGameCode = this.scene.add.text(this.txtSelectedCode.x, this.txtSelectedCode.y, "", {
      fontSize: "64px",
      backgroundColor: '#91e278',
      color: 'black',
      fontStyle: 'bold',
      padding: {
        left: 16,
        right: 0,
        y: 16
      }
    })
  }

  createSuccessTick() {
    const x = this.txtSelectedCode.x + this.txtSelectedCode.width + 20;
    const y = this.txtSelectedCode.y;
    this.successTick = this.scene.add.sprite(x, y, "tick");
    this.successTick.setAlpha(0);
  }

  private refreshCode() {
    this.txtGameCode.setText(this.code);
    this.txtGameCode.setPosition(
      this.x - this.txtSelectedCode.width / 2,
      this.y - this.txtSelectedCode.height / 2
    )
  }

  private refreshSelectedCode() {
    this.txtSelectedCode.setText(this.selectedCode)
  }

  private selectCode() {
    this.selectedCode = this.CODES[Phaser.Math.Between(0, this.CODES.length - 1)];
    this.code = "";
    this.currentCharIndex = 0;

    this.refreshSelectedCode();
    this.refreshCode();

    if (this.timerEnabled)
      this.refreshTimer();
  }

  private breakCode() {
    this.selectCode();
    this.scene.cameras.main.shake();

    if (this.onBreakCode)
      this.onBreakCode();
  }

  private saveCode() {
    this.showSuccessTick();
    this.selectCode();
    if (this.onSaveCode)
      this.onSaveCode();
  }

  private showSuccessTick() {
    this.successTick.x = this.txtSelectedCode.x + this.txtSelectedCode.width + 60;
    if (!this.successTickTween) {
      this.successTickTween = this.scene.add.tween({
        targets: this.successTick,
        alpha: {
          from: 1,
          to: 0
        },
        y: {
          from: this.txtSelectedCode.y,
          to: this.txtGameCode.y - 100
        }
      })
    } else {
      this.successTickTween.restart();
    }

  }

  private createTimer() {
    this.codeTimerLine = this.scene.add.rectangle(
      this.x,
      this.y,
      this.txtSelectedCode.width,
      8,
      0xFF0000
    );
  }

  private refreshTimer() {
    if (this.codeTimerLine) {
      this.codeTimerLine.setSize(
        this.txtSelectedCode.width,
        this.codeTimerLine.height
      );
      this.codeTimerLine.setPosition(
        this.x,
        this.y - 10 - this.txtSelectedCode.height / 2,
      )

      if (this.codeTimerTween)
        this.codeTimerTween.remove();

      this.codeTimerTween = this.scene.tweens.add({
        targets: this.codeTimerLine,
        width: {
          from: this.codeTimerLine.width,
          to: 0
        },
        duration: this.getTotalTimerDuration(),
        onComplete: () => {
          this.breakCode();
        }
      })
    }
  }

  public write(key: string) {

    this.keyboardSound.stop();
    this.keyboardSound.play();

    if (this.selectedCode[this.currentCharIndex].toLowerCase() === key.toLowerCase()) {
      this.code += key.toLowerCase();
      this.currentCharIndex++;
      this.refreshCode();
      if (!this.selectedCode[this.currentCharIndex]) {
        this.saveCode();
      }
    } else {
      this.breakCode();
    }
  }

  public decreaseTimerDuration(value: number) {
    this.codeTimerDuration -= value;
  }

  public increaseTimerDuration(value: number) {
    this.codeTimerDuration += value;
  }

  public setTimerDuration(value: number) {
    this.codeTimerDuration = value;
  }

  public setTimerDurationSpeedUp(value: number) {
    this.codeTimerDurationSpeedUp = value;
  }

  public getTotalTimerDuration() {
    return this.codeTimerDuration - this.codeTimerDurationSpeedUp;
  }

}