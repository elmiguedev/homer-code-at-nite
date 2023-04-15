import { Scene } from "phaser";

export class CodeCommander {
  private scene: Scene;
  private x: number;
  private y: number;
  private command: string = "";

  public onSave!: Function;

  private txtCommand!: Phaser.GameObjects.Text;
  private keyboardSound!: Phaser.Sound.BaseSound;

  constructor(scene: Scene, x: number, y: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.create();
  }

  create() {
    this.keyboardSound = this.scene.sound.add("keyboard");
    this.txtCommand = this.scene.add.text(
      this.x,
      this.y,
      "/",
      {
        backgroundColor: "black",
        color: "#D22B2B",
        fontSize: "64px",
        fontStyle: "bold",
        padding: {
          y: 30,
          x: 26
        }
      }
    ).setOrigin(0.5);
    this.txtCommand.setVisible(false);
    this.checkInput();

  }

  checkInput() {
    const NON_KEYS_VALUES = ["Shift", "Control", "Alt", "/"]
    this.scene.input.keyboard.on("keydown", (e: any) => {
      e.preventDefault();
      if (this.isEnabled()) {

        this.keyboardSound.stop();
        this.keyboardSound.play();

        if (NON_KEYS_VALUES.includes(e.key)) return;
        if (e.key === "Enter") { this.executeCommand(); return; }
        if (e.key === "Escape") { this.disable(); return; }
        if (e.key === "Backspace") { this.command = this.command.slice(0, -1); this.refreshCommandText(); return; }
        this.command += e.key;
        this.refreshCommandText();
      }
    })
  }

  enable() {
    this.txtCommand.visible = true;
    this.command = "";
    this.refreshCommandText();
  }

  disable() {
    this.txtCommand.visible = false;
  }

  isEnabled() {
    return this.txtCommand.visible;
  }

  refreshCommandText() {
    this.txtCommand.setText(`/${this.command}`)
  }

  executeCommand() {
    if (this.command !== "") {
      this.disable();
      switch (this.command) {
        case "commit": this.save(); break;
        default: break;
      }
    }
  }

  private save() {
    if (this.onSave) this.onSave();
  }

}