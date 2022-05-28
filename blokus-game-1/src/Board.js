import { Container } from "@createjs/easeljs";

export default class Board {
  constructor(width = null, height = null, x = null, y = null, stage = null) {
    if (
      width === null ||
      height === null ||
      x === null ||
      y === null ||
      stage === null
    ) {
      throw new Error("width, height and stage are required");
    }

    this.width = width;
    this.height = height;
    this.container = new Container();
    this.container.set({
      x,
      y,
    });
    this.stage = stage;
    this.stage.addChild(this.container);
  }
  makeContainer(x = 0, y = 0) {
    const container = new Container();
    container.set({
      x,
      y,
    });
    this.container.addChild(container);
    this.stage.update();
    return container;
  }
}
