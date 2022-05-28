import { Bitmap, Container, Graphics, Shape } from "@createjs/easeljs";

export default class Stage {
  constructor(canvas, width, height) {
    this.canvas = {
      elem: canvas,
      width,
      height,
    };
    this.canvas.elem.getContext("2d").scale(20, 20);
    this.stage = new Stage(canvas);
    this.stage.enableMouseOver();
  }
  //add image
  addImage(width, height, src, x, y, container, clickHandler) {
    const image = new Image(width, height);
    image.src = `./src/${src}`;
    image.onload = handleLoad.bind(this);

    function handleLoad(evt) {
      const image = evt.target;
      const bitmap = new Bitmap(image);
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
  drawRect(color, x, y, width, height, container) {
    const graphics = new Graphics();
    graphics.setStrokeStyle(1);
    graphics.beginStroke("#000");
    graphics.beginFill(color);
    graphics.drawRect(x, y, width, height);
    const shape = new Shape(graphics);
    if (container) {
      container.addChild(shape);
      this.addChild(container);
    } else {
      this.addChild(shape);
    }
    this.update();
    return shape;
  }
  // draw a line
  drawLine(color, startX, startY, toX, toY, stroke, container) {
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
  addText(text, font, color, dir, x, y, container) {
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
  update() {
    this.stage.update();
  }
  addChild(child) {
    this.stage.addChild(child);
  }
}
