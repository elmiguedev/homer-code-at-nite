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
      this.scene.start("MainScene");
    }
  }

  createGoogleButton() {
    this.googleButton = this.add.text(20, 20, "Google", {
      backgroundColor: "#FF0000",
      color: "white",
      fontStyle: "bold",
      padding: {
        x: 10,
        y: 10
      },
    });
    this.googleButton.setInteractive({ cursor: "pointer" });
    this.googleButton.on('pointerdown', async () => {
      const token = await this.handleGoogleLogin();
      console.log(token)
    });
  }

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

    this.add.text(x, 200, "Press [Enter] to start the game", {
      fontSize: "32px",
    }).setOrigin(0.5)

  }



  async handleGoogleLogin() {
    const params = {
      client_id: CLIENT_ID,
      redirect_uri: 'http://localhost:5173',
      response_type: 'token',
      scope: 'email profile',
    };
    const url = `https://accounts.google.com/o/oauth2/auth?${new URLSearchParams(params)}`;
    const newWindow = window.open(url, '_blank', 'height=600,width=800');
    const token = await this.waitForAuthResponse(newWindow);
    console.log("EL TOKEN", token)
    const res = await fetch("http://localhost:3000/scores", {
      headers: {
        Authorization: 'bearer ' + token
      }
    })

    const data = await res.json();
    console.log(data);
  }


  async waitForAuthResponse(newWindow: any) {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(intervalId);
          reject(new Error('La ventana de autenticación fue cerrada sin completar la autenticación.'));
        } else {
          try {
            const hash = newWindow.location.hash;
            if (hash) {
              const params = new URLSearchParams(hash.substring(1));
              const token = params.get('access_token');
              if (token) {
                newWindow.close();
                resolve(token);
              }
            }
          } catch (error) {
            // Ignorar errores de seguridad al intentar acceder a la ventana cruzada.
          }
        }
      }, 100);
    });
  }

  getCenterScreen() {
    return {
      x: this.game.canvas.width / 2,
      y: this.game.canvas.height / 2
    }
  }

}