import { Scene } from "phaser";
import { Homer } from "../entities/Homer";
const CLIENT_ID = '730701502198-2fhl8u38phe6nlpdi2eosa4412o30g1e.apps.googleusercontent.com'; // Reemplazar con el client ID de Google

export class StartScene extends Scene {

  private startKey?: Phaser.Input.Keyboard.Key;
  private googleButton!: Phaser.GameObjects.Text;
  private title!: Phaser.GameObjects.Text;
  private homer!: Homer;

  constructor() {
    super("StartScene");
  }

  create() {

    this.createBackground();
    this.createHomer();
    this.createTitles();
    // this.createGoogleButton();
    this.createKeys();
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
    this.homer.setHappy();
  }

  createKeys() {
    this.startKey = this.input.keyboard.addKey("enter");
    this.startKey.onDown = () => {
      this.scene.start("InstructionsScene");
    }
  }

  // createGoogleButton() {
  //   this.googleButton = this.add.text(20, 20, "Google", {
  //     backgroundColor: "#FF0000",
  //     color: "white",
  //     fontStyle: "bold",
  //     padding: {
  //       x: 10,
  //       y: 10
  //     },
  //   });
  //   this.googleButton.setInteractive({ cursor: "pointer" });
  //   this.googleButton.on('pointerdown', async () => {
  //     const token = await this.handleGoogleLogin();
  //     console.log(token)
  //   });
  // }

  createTitles() {
    const x = this.game.canvas.width / 2;
    this.title = this.add.text(x, 100, "Code at nite, with homer0  ", {
      fontSize: "64px",
      backgroundColor: 'white',
      color: 'black',
      fontStyle: 'bold',
      padding: {
        x: 16,
        y: 16
      }
    }).setOrigin(0.5)
    const prompt = this.add.rectangle(x + this.title.width / 2 - 40, 100, 10, 60, 0x000000);
    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        prompt.setVisible(!prompt.visible);
      }
    })

    this.add.text(x, 200, "Presiona [Enter] para comenzar", {
      fontSize: "32px",
    }).setOrigin(0.5)

  }

  getCenterScreen() {
    return {
      x: this.game.canvas.width / 2,
      y: this.game.canvas.height / 2
    }
  }

}