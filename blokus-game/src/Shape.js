import { Container } from "@createjs/easeljs";
import extractMatrix from "../utils/extractSubMatrix";

const shapes = [
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
];

export default class Shape {
  constructor(number, game, player) {
    this.number = number;
    this.matrix = [...shapes[this.number - 1].map((elem) => [...elem])];
    this.game = game;
    this._canvasShape = null;
    this.player = player;
    player.shapes.push(this);
  }
  draw(startJ = 0, startI = 0, color = "", addToStage = true) {
    let matrix = extractMatrix(this.matrix);
    const container = new Container();
    container.set({
      x: startJ,
      y: startI,
    });

    this.canvasShape = container;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          this.game.drawRect(
            color,
            j * this.game.container.COLS,
            i * this.game.container.ROWS,
            this.game.container.ROWS,
            this.game.container.COLS,
            container,
            null,
            null,
            addToStage
          );
        }
      }
    }
  }
  get canvasShape() {
    return this._canvasShape;
  }
  set canvasShape(newCanvasShape) {
    this._canvasShape = newCanvasShape;
  }
  flip() {
    // flip the matrix
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < Math.floor(this.matrix[i].length / 2); j++) {
        [this.matrix[i][j], this.matrix[i][this.matrix[i].length - j - 1]] = [
          this.matrix[i][this.matrix[i].length - j - 1],
          this.matrix[i][j],
        ];
      }
    }
    this.draw(0, 0, this.player.color, false);
    return this;
  }
  rotateLeft() {
    for (let i = 0; i < parseInt(this.matrix.length / 2); i++) {
      for (let j = i; j < this.matrix[i].length - i - 1; j++) {
        // Swap elements of each cycle
        // in clockwise direction
        let temp = this.matrix[i][j];
        this.matrix[i][j] = this.matrix[this.matrix.length - 1 - j][i];
        this.matrix[this.matrix.length - 1 - j][i] =
          this.matrix[this.matrix.length - 1 - i][this.matrix.length - 1 - j];
        this.matrix[this.matrix.length - 1 - i][this.matrix.length - 1 - j] =
          this.matrix[j][this.matrix.length - 1 - i];
        this.matrix[j][this.matrix.length - 1 - i] = temp;
      }
    }
    this.draw(0, 0, this.player.color, false);
    return this;
  }
  rotateRight() {
    for (let i = 0; i < Math.floor(this.matrix.length / 2); i++) {
      for (let j = i; j < this.matrix.length - i - 1; j++) {
        //Store the right value and start the rotation from here
        let temp = this.matrix[i][j];

        // Move values from right to top
        this.matrix[i][j] = this.matrix[j][this.matrix.length - 1 - i];

        // Move values from bottom to right
        this.matrix[j][this.matrix.length - 1 - i] =
          this.matrix[this.matrix.length - 1 - i][this.matrix.length - 1 - j];

        // Move values from left to bottom
        this.matrix[this.matrix.length - 1 - i][this.matrix.length - 1 - j] =
          this.matrix[this.matrix.length - 1 - j][i];

        // Assign temp to left
        this.matrix[this.matrix.length - 1 - j][i] = temp;
      }
    }
    this.draw(0, 0, this.player.color, false);
    return this;
  }
}
