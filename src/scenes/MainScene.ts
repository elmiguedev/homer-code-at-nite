import { Scene } from "phaser";
import { MainHud } from "../huds/MainHud";
import { CodeCommander } from "../entities/CodeCommander";
import { Code } from "../entities/Code";
import { Homer } from "../entities/Homer";


export class MainScene extends Scene {

  private SONGS = ["avril", "batman", "blink", "korn", "lp", "paparoach", "pokemon"]
  private currentSong!: Phaser.Sound.BaseSound;

  private mainDifficultyTimer!: Phaser.Time.TimerEvent;
  private codeCommander!: CodeCommander;
  private code!: Code;
  private homer!: Homer;

  private hud!: MainHud;

  private saveCount: number = 0;
  private codeIntegrity: number = 10;
  private score: number = 0;
  private cokeEnabled: boolean = false;

  constructor() {
    super("MainScene");
  }

  create() {
    this.resetState();
    this.createBackground();
    this.createHomer();
    this.createCode();
    this.createCodeListener();
    this.createHud();

    this.createCommander();

    this.createDifficultyTimer();
    this.playSong();
  }

  createBackground() {
    const center = this.getCenterScreen();
    const background = this.add.image(
      center.x,
      center.y,
      "background"
    );
    background.setScale(10);
    background.setPosition(
      center.x,
      this.game.canvas.height - background.displayHeight
    ).setOrigin(0.5, 0)
  }

  createHomer() {
    const center = this.getCenterScreen();
    this.homer = new Homer(
      this,
      center.x,
      center.y,
    );
  }

  createCode() {
    const center = this.getCenterScreen();
    this.code = new Code(this, center.x, 240, true);
    this.code.onBreakCode = () => {
      this.breakCode();
    }
    this.code.onSaveCode = () => {
      this.saveCode();
    }
  }

  createCodeListener() {
    const NON_KEYS_VALUES = ["Shift", "Control", "Alt", "Meta", "Tab"]
    this.input.keyboard.on("keydown", (e: any) => {
      if (NON_KEYS_VALUES.includes(e.key)) return;
      if (!this.codeCommander.isEnabled()) {
        if (e.key === "Enter") { this.codeCommander.enable(); return; };
        this.code.write(e.key);
      }
    })
  }

  createCommander() {
    const center = this.getCenterScreen();

    this.codeCommander = new CodeCommander(this, center.x, center.y);
    this.codeCommander.onSave = () => {
      this.commitCode();
    }
  }

  createDifficultyTimer() {
    this.mainDifficultyTimer = this.time.addEvent({
      loop: true,
      delay: 5000,
      callback: () => {
        this.increaseDifficulty();
        this.requestCoke();
      }
    })
  }

  createHud() {
    this.hud = new MainHud({
      saveCount: this.saveCount,
      codeIntegrity: this.codeIntegrity,
      score: this.score
    });
    this.scene.add("MainHud", this.hud);
    this.scene.launch("MainHud");
  }


  // control methods
  // ---------------------------

  playSong() {
    const key = this.SONGS[Phaser.Math.Between(0, this.SONGS.length - 1)];
    if (this.currentSong) this.currentSong.destroy();
    this.currentSong = this.sound.add(key, { volume: 0.3 });
    this.currentSong.on("complete", () => { this.playSong() })
    this.currentSong.play();
  }

  resetState() {
    this.codeIntegrity = 100;
    this.saveCount = 0;
    this.score = 0;
  }

  saveCode() {
    this.sound.play("save");
    this.saveCount++;
    this.score++;
    this.homer.happy();
    this.refreshHud();
  }

  breakCode(value?: number) {
    this.sound.play("break");
    this.saveCount = 0;
    this.codeIntegrity -= value || 5;
    this.checkGameState();
    this.homer.angry();
    this.refreshHud();
  }

  commitCode() {
    this.sound.play("commit");
    this.score += this.saveCount * this.saveCount;
    this.codeIntegrity += this.saveCount * 5;
    this.saveCount = 0;
    this.refreshHud();
  }

  refreshHud() {
    this.hud.setState({
      saveCount: this.saveCount,
      codeIntegrity: this.codeIntegrity,
      score: this.score
    })
  }


  checkGameState() {
    if (this.codeIntegrity <= 0) {
      this.finishGame();
    } else if (this.codeIntegrity <= 20) {
      this.cameras.main.setBackgroundColor(0xf00000);
    } else if (this.codeIntegrity <= 40) {
      this.cameras.main.setBackgroundColor(0xb80000);
    } else if (this.codeIntegrity <= 60) {
      this.cameras.main.setBackgroundColor(0x660000);
    } else if (this.codeIntegrity <= 80) {
      this.cameras.main.setBackgroundColor(0x310000);
    } else if (this.codeIntegrity <= 100) {
      this.cameras.main.setBackgroundColor(0x000000);
    }
  }

  increaseDifficulty() {
    this.code.decreaseTimerDuration(200);
  }

  requestCoke() {
    const cokeProb = Math.random();
    if (cokeProb < 0.1) {
      this.enableCoke();
    }
  }

  enableCoke() {
    this.cokeEnabled = true;
    const timer = this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.cokeEnabled = false;
        timer.remove();
      }
    })
  }

  drinkCoke() {
    this.code.increaseTimerDuration(600);
  }

  finishGame() {
    this.sound.stopAll();
    this.scene.remove(this.hud);
    // this.scene.start("GameOverScene")
    this.scene.start("StartScene")
  }

  getCenterScreen() {
    return {
      x: this.game.canvas.width / 2,
      y: this.game.canvas.height / 2
    }
  }

}