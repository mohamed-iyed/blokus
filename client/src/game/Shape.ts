import { Container, DisplayObject } from "createjs-module";
import extractMatrix from "../utils/extractSubMatrix";
import GameStage from "./GameStage";
import Player from "./Player";

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
  [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
];

export default class Shape {
  number: number;
  matrix: number[][];
  stage: GameStage;
  _canvasShape: DisplayObject | null;
  _originalCanvasShape: DisplayObject | null;
  player: Player;

  constructor(number: number, stage: GameStage, player: Player) {
    this.number = number;
    this.matrix = [...shapes[this.number - 1].map((elem) => [...elem])];
    this.stage = stage;
    this._canvasShape = null;
    this._originalCanvasShape = null;
    this.player = player;
    player.shapes.push(this);
  }
  draw(startJ = 0, startI = 0, color = this.player.color) {
    let matrix = extractMatrix(this.matrix);
    const shape = new Container();
    shape.set({
      x: startJ,
      y: startI,
    });

    this.canvasShape = shape;

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          this.stage.drawRect(
            color,
            j * this.stage.cellWidth,
            i * this.stage.cellWidth,
            this.stage.cellWidth,
            this.stage.cellWidth,
            shape
          );
        }
      }
    }
    return this.canvasShape;
  }
  get canvasShape() {
    return this._canvasShape;
  }
  set canvasShape(newCanvasShape) {
    this._canvasShape = newCanvasShape;
  }
  get originalCanvasShape() {
    return this._originalCanvasShape;
  }
  set originalCanvasShape(newCanvasShape) {
    this._originalCanvasShape = newCanvasShape;
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
    this.draw(0, 0, this.player.color);
    return this;
  }
  rotateLeft() {
    for (let i = 0; i < this.matrix.length / 2; i++) {
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
    this.draw(0, 0, this.player.color);
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
    this.draw(0, 0, this.player.color);
    return this;
  }
}
