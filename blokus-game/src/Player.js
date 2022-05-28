import Shape from "./Shape";

export default class Player {
  constructor(color, type) {
    this.color = color;
    this.type = type;
    this.shapes = [];
  }
  drawShapes(
    game,
    [
      { x: x1 = 0, y: y1 = 0 },
      { x: x2 = 0, y: y2 = 0 },
      { x: x3 = 0, y: y3 = 0 },
      { x: x4 = 0, y: y4 = 0 },
      { x: x5 = 0, y: y5 = 0 },
      { x: x6 = 0, y: y6 = 0 },
      { x: x7 = 0, y: y7 = 0 },
      { x: x8 = 0, y: y8 = 0 },
      { x: x9 = 0, y: y9 = 0 },
      { x: x10 = 0, y: y10 = 0 },
      { x: x11 = 0, y: y11 = 0 },
      { x: x12 = 0, y: y12 = 0 },
      { x: x13 = 0, y: y13 = 0 },
      { x: x14 = 0, y: y14 = 0 },
      { x: x15 = 0, y: y15 = 0 },
      { x: x16 = 0, y: y16 = 0 },
      { x: x17 = 0, y: y17 = 0 },
      { x: x18 = 0, y: y18 = 0 },
      { x: x19 = 0, y: y19 = 0 },
      { x: x20 = 0, y: y20 = 0 },
    ]
  ) {
    const shape = new Shape(1, game, this);
    shape.draw(x1, y1, this.color);
    const shape1 = new Shape(2, game, this);
    shape1.draw(x2, y2, this.color);
    const shape2 = new Shape(3, game, this);
    shape2.draw(x3, y3, this.color);
    const shape3 = new Shape(4, game, this);
    shape3.draw(x4, y4, this.color);
    const shape4 = new Shape(5, game, this);
    shape4.draw(x5, y5, this.color);
    const shape5 = new Shape(6, game, this);
    shape5.draw(x6, y6, this.color);
    const shape6 = new Shape(7, game, this);
    shape6.draw(x7, y7, this.color);
    const shape7 = new Shape(8, game, this);
    shape7.draw(x8, y8, this.color);
    const shape8 = new Shape(9, game, this);
    shape8.draw(x9, y9, this.color);
    const shape9 = new Shape(10, game, this);
    shape9.draw(x10, y10, this.color);
    const shape10 = new Shape(11, game, this);
    shape10.draw(x11, y11, this.color);
    const shape11 = new Shape(12, game, this);
    shape11.draw(x12, y12, this.color);
    const shape12 = new Shape(13, game, this);
    shape12.draw(x13, y13, this.color);
    const shape13 = new Shape(14, game, this);
    shape13.draw(x14, y14, this.color);
    const shape14 = new Shape(15, game, this);
    shape14.draw(x15, y15, this.color);
    const shape15 = new Shape(16, game, this);
    shape15.draw(x16, y16, this.color);
    const shape16 = new Shape(17, game, this);
    shape16.draw(x17, y17, this.color);
    const shape17 = new Shape(18, game, this);
    shape17.draw(x18, y18, this.color);
    const shape18 = new Shape(19, game, this);
    shape18.draw(x19, y19, this.color);
    const shape19 = new Shape(20, game, this);
    shape19.draw(x20, y20, this.color);

    return this;
  }
}
