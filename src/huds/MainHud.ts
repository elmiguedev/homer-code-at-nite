import { Scene } from "phaser";

export interface MainHudState {
  saveCount: number;
  codeIntegrity: number;
  score: number;
}

export class MainHud extends Scene {

  private state: MainHudState;
  private txtSaveCount!: Phaser.GameObjects.Text;
  private txtCodeIntegrity!: Phaser.GameObjects.Text;
  private txtScore!: Phaser.GameObjects.Text;

  private saveGroup!: Phaser.GameObjects.Group;

  constructor(state: MainHudState) {
    super("MainHud")
    this.state = state;
  }

  create() {
    this.createAuxStateText();
    this.saveGroup = this.add.group();
    this.createScoreText();
    this.refresh();
  }

  private createAuxStateText() {
    this.txtSaveCount = this.add.text(20, 20, "").setVisible(false);
    this.txtCodeIntegrity = this.add.text(20, 40, "").setVisible(false);
  }

  private createScoreText() {
    const x = this.game.canvas.width / 2;
    const y = 100;
    this.txtScore = this.add.text(x, y, "", {
      fontSize: '72px'
    }).setOrigin(0.5);
  }

  setState(state: MainHudState) {
    this.state = state;
    this.refresh();
  }

  refresh() {
    this.txtSaveCount.setText(`Your saves: ${this.state.saveCount}`);
    this.txtCodeIntegrity.setText(`Code integrity: ${this.state.codeIntegrity}`);
    this.txtScore.setText(`${this.state.score}`);
    this.createSaves();
  }

  private createSaves() {
    this.saveGroup.clear(true);
    for (let i = 0; i < this.state.saveCount; i++) {
      const x = 100 + (i * 80);
      const y = 100;
      const save = this.add.sprite(x, y, "save");
      this.saveGroup.add(save);
    }
  }


}