import { Scene } from "phaser";

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
    this.progressBar = this.add.rectangle(x, y, 0, 40, 0xFFFFFF, 0.5);
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
    })
  }

  loadAssetsGame() {


    this.load.image("example", "assets/img/example.png")
    this.load.image("tick", "assets/img/tick.png")
    this.load.image("background", "assets/img/background.png")
    this.load.image("homer_ok", "assets/img/homer_ok.png")
    this.load.image("homer_coding", "assets/img/homer_coding.png")
    this.load.image("homer_bad", "assets/img/homer_bad.png")
    this.load.image("save", "assets/img/save.png")

    this.load.audio("avril", "assets/sounds/avril.mp3");
    this.load.audio("batman", "assets/sounds/batman.mp3");
    this.load.audio("blink", "assets/sounds/blink.mp3");
    this.load.audio("korn", "assets/sounds/korn.mp3");
    this.load.audio("lp", "assets/sounds/lp.mp3");
    this.load.audio("paparoach", "assets/sounds/paparoach.mp3");
    this.load.audio("pokemon", "assets/sounds/pokemon.mp3");

    this.load.audio("keyboard", "assets/sounds/keyboard.mp3");
    this.load.audio("save", "assets/sounds/save.wav");
    this.load.audio("break", "assets/sounds/break.wav");
    this.load.audio("commit", "assets/sounds/commit.wav");

    this.load.start();

    this.load.on("progress", (value: any) => {
      this.progressBar.setSize(300 * value, 40);
    });

    this.load.on("fileprogress", (file: any) => {
      if (file.src.includes("sounds")) this.progressText.setText("cargando audios");
      else if (file.src.includes("img")) this.progressText.setText("cargando imagenes");
      else this.progressText.setText("cargando recursos");

    });

    this.load.once("complete", (e: any) => {
      this.scene.start("StartScene");
    });
  }

  loadAssetsLoading() {
    this.load.spritesheet("chancho", "assets/img/chancho.png", {
      frameWidth: 512,
      frameHeight: 512
    })
  }
}