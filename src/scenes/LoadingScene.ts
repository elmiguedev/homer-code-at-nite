import { Scene } from "phaser";
import chanchoPng from "../assets/img/chancho/chancho.png";
import examplePng from "../assets/img/example.png";
import tickPng from "../assets/img/tick.png";
import backgroundPng from "../assets/img/background.png";
import homerOkPng from "../assets/img/homer_ok.png";
import homerCodingPng from "../assets/img/homer_coding.png";
import homerBadPng from "../assets/img/homer_bad.png";
import savePng from "../assets/img/save.png";

import avrilMp3 from "../assets/sounds/avril.mp3";
import batmanMp3 from "../assets/sounds/batman.mp3";
import blinkMp3 from "../assets/sounds/blink.mp3";
import kornMp3 from "../assets/sounds/korn.mp3";
import lpMp3 from "../assets/sounds/lp.mp3";
import paparoachMp3 from "../assets/sounds/paparoach.mp3";
import pokemonMp3 from "../assets/sounds/pokemon.mp3";
import keyboardMp3 from "../assets/sounds/keyboard.mp3";
import saveWav from "../assets/sounds/save.wav";
import breakWav from "../assets/sounds/break.wav";
import commitWav from "../assets/sounds/commit.wav";

export class LoadingScene extends Scene {

  private progressBar!: Phaser.GameObjects.Rectangle;
  private progressText!: Phaser.GameObjects.Text;

  constructor() {
    super("LoadingScene");
  }

  preload() {
    this.loadAssets();
  }

  create() {
    this.createChancho();
    this.createProgressBar();
    this.createProgressText();
  }

  createChancho() {
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("chancho", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 8, 9, 10, 11, 12]
      }),
      frameRate: 12,
      repeat: -1
    })

    const x = this.game.canvas.width / 2;
    const y = this.game.canvas.height / 2;
    const chancho = this.add.sprite(x, y, "chancho");

    chancho.play("idle")
  }

  createProgressBar() {
    const x = this.game.canvas.width / 2;
    const y = this.game.canvas.height / 2 + 300;
    const progressBarBackground = this.add.rectangle(x, y, 340, 80, 0xFFFFFF, 0.1);
    this.progressBar = this.add.rectangle(x - 150, y, 0, 40, 0xFFFFFF, 0.5);
  }

  createProgressText() {
    const x = this.game.canvas.width / 2;
    const y = this.game.canvas.height / 2 + 400;
    this.progressText = this.add.text(x, y, "archivo", {
      fontSize: "48px"
    }).setOrigin(0.5);
  }

  loadAssets() {
    this.loadAssetsLoading();
    this.load.once("complete", () => {
      this.createChancho();
      this.createProgressBar();
      this.loadAssetsGame();
      // this.load.start();
    })
  }

  loadAssetsGame() {


    this.load.image("example", examplePng)
    this.load.image("tick", tickPng)
    this.load.image("background", backgroundPng)
    this.load.image("homer_ok", homerOkPng)
    this.load.image("homer_coding", homerCodingPng)
    this.load.image("homer_bad", homerBadPng)
    this.load.image("save", savePng)

    this.load.audio("avril", avrilMp3);
    this.load.audio("batman", batmanMp3);
    this.load.audio("blink", blinkMp3);
    this.load.audio("korn", kornMp3);
    this.load.audio("lp", lpMp3);
    this.load.audio("paparoach", paparoachMp3);
    this.load.audio("pokemon", pokemonMp3);

    this.load.audio("keyboard", keyboardMp3);
    this.load.audio("save", saveWav);
    this.load.audio("break", breakWav);
    this.load.audio("commit", commitWav);

    this.load.start();

    this.load.on("progress", (value: any) => {
      console.log(value)
      this.progressBar.setSize(300 * value, 40);
    });

    this.load.on("fileprogress", (file: any) => {
      if (file.src.includes("sounds")) this.progressText.setText("cargando audios");
      else if (file.src.includes("img")) this.progressText.setText("cargando imagenes");
      else this.progressText.setText("finalizando recursos");

    });

    this.load.once("complete", (e: any) => {
      this.scene.start("StartScene");
    });
  }

  loadAssetsLoading() {
    this.load.spritesheet("chancho", chanchoPng, {
      frameWidth: 512,
      frameHeight: 512
    })
  }
}