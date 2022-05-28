import { Container } from "@createjs/easeljs";

export default class Board {
  constructor(x, y, stage) {
    this.container = new Container();
    this.container.set({
      x,
      y,
    });
    this.stage = stage;
    this.stage.addChild(container);
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
