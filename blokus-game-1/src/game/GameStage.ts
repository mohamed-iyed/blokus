import {
  Bitmap,
  Container,
  DisplayObject,
  Graphics,
  Shape,
  Stage,
  Text,
} from "createjs-module";

export default class GameStage {
  canvas: HTMLCanvasElement;
  cellWidth: number;
  stage: Stage;

  constructor(canvas: HTMLCanvasElement, cellWidth: number) {
    this.canvas = canvas;
    this.cellWidth = cellWidth;
    this.canvas?.getContext("2d")?.scale(20, 20);
    this.stage = new Stage(this.canvas);
    this.stage.enableMouseOver();
  }
  //add image
  addImage(
    width: number,
    height: number,
    src: string,
    x: number,
    y: number,
    container?: Container,
    clickHandler?: (eventObj: Object) => void
  ) {
    const image = new Image(width, height);
    image.src = `./src/${src}`;
    image.onload = handleLoad.bind(this);

    function handleLoad(this: GameStage, evt: any) {
      const image = evt.target;
      const bitmap = new Bitmap(image);
      bitmap.set({
        x: 2.5,
        y: 2.5,
      });
      const imgContainer = new Container();
      this.drawRect("white", 0, 0, 30, 30, imgContainer);
      imgContainer.addChild(bitmap);
      imgContainer.set({
        x,
        y,
      });
      if (clickHandler) {
        imgContainer.on("click", clickHandler);
        imgContainer.cursor = "pointer";
      }

      if (container) {
        container.addChild(imgContainer);
      }
      this.update();
    }
  }
  // draw Rectange
  drawRect(
    color: string,
    x: number,
    y: number,
    width: number,
    height: number,
    container: Container
  ) {
    const graphics = new Graphics();
    graphics.setStrokeStyle(1);
    graphics.beginStroke("#000");
    graphics.beginFill(color);
    graphics.drawRect(x, y, width, height);
    const shape = new Shape(graphics);
    if (container) {
      container.addChild(shape);
    } else {
      this.addChild(shape);
    }
    this.update();
    return shape;
  }
  // draw a line
  drawLine(
    color: string,
    startX: number,
    startY: number,
    toX: number,
    toY: number,
    stroke: number,
    container?: Container
  ) {
    const line = new Shape();
    line.graphics.setStrokeStyle(stroke);
    line.graphics.beginStroke(color);
    line.graphics.moveTo(startX, startY);
    line.graphics.lineTo(toX, toY);
    line.graphics.endStroke();
    if (container) {
      container.addChild(line);
    } else {
      this.addChild(line);
    }
    this.update();
  }
  // adding text
  addText(
    text: string,
    font: string,
    color: string,
    dir: string,
    x: number,
    y: number,
    container?: Container
  ) {
    const newText = new Text(text, font, color);
    newText.set({
      textAlign: dir || "center",
      textBaseline: "middle",
      x,
      y,
    });
    if (container) {
      container.addChild(newText);
    } else {
      this.addChild(newText);
    }
    this.update();
    return newText;
  }
  // update the stage
  update() {
    this.stage.update();
  }
  // add child to stage
  addChild(child: DisplayObject) {
    this.stage.addChild(child);
  }
}
