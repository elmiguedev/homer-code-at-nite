export class InstructionsScene extends Phaser.Scene {
  constructor() {
    super("InstructionsScene");
  }

  create() {
    this.add.text(this.game.canvas.width / 2, 200, "Instrucciones", {
      fontSize: "64px",
    }).setOrigin(0.5)
    this.add.text(this.game.canvas.width / 2, 600, `
    Tipea el código que ves en pantalla para que homer0 pueda completar su aplicación.
    Si lo escribes correctamente sumarás puntos y saves. 
    A medida que acumulas save más puntos podrás sumar al hacer un commit.

    Para hacer commit: Debes apretar [Enter] y escribir el comando "commit"

    Mientras mas saves tengas en un commit, más puntos sumarás, pero cuidado! si te equivocas, pierdes todos tus save


    - presiona [Enter] y comienza a programar -
    `, {
      fontSize: "42px",
      align: 'center'
    }).setWordWrapWidth(this.game.canvas.width - 100).setOrigin(0.5)

    const enterKey = this.input.keyboard.addKey("enter");
    enterKey.onDown = () => {
      this.scene.start("MainScene");
    }

  }
}