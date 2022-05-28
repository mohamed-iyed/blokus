import Board from "./Board";

export default class ControlBoard extends Board {
  constructor(stage) {
    super(800, 0, stage);
  }
  draw() {
    // the background for the control board
    this.stage.drawRect("#FAFAFA", 0, 0, 400, 800, this.container);
    // show the activeShape
    this.activeShapeContainer = this.makeContainer(25, 20);

    this.stage.drawRect("#F5F5F5", 0, 0, 350, 300, this.activeShapeContainer);
    this.stage.addText(
      "ACTIVE SHAPE",
      "bold 30px Arial",
      "#555555",
      "center",
      1000,
      45
    );
  }
}
