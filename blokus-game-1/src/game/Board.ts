import { Container } from "createjs-module";
import GameStage from "./GameStage";

export default class Board {
  width: number;
  height: number;
  container: Container;
  stage: GameStage;
  constructor(
    width: number,
    height: number,
    x: number,
    y: number,
    stage: GameStage
  ) {
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
