import { Container } from "createjs-module";
import Board from "./Board";
import GameStage from "./GameStage";
import Player from "./Player";
import GameShape from "./Shape";

interface matrixCell {
  canPlace: any[];
  color: null | string;
  cell: Container;
}

class CellsBoard {
  container: Container;
  matrix: matrixCell[][];
  constructor(container: Container) {
    this.container = container;
    this.matrix = [];
  }
  // intilize the cells board
  initialize(ROWS: number, COLS: number, stage: GameStage) {
    for (let i = 0; i < ROWS; i++) {
      this.matrix[i] = [];
      for (let j = 0; j < COLS; j++) {
        // make a board cell
        const cell = new Container();
        cell.set({
          x: j * stage.cellWidth,
          y: i * stage.cellWidth,
        });
        stage.drawRect("#CCC", 0, 0, stage.cellWidth, stage.cellWidth, cell);
        this.container.addChild(cell);
        this.matrix[i].push({ canPlace: [], color: null, cell });
      }
    }
  }
  *[Symbol.iterator]() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        yield this.matrix[i][j];
      }
    }
  }
}

export default class GameBoard extends Board {
  #POSITIONS = () => [
    {
      playerShapesPositions: [
        { x: 10, y: 40 },
        { x: 10, y: 80 },
        { x: 10, y: 150 },
        { x: 10, y: 260 },
        { x: 10, y: 330 },
        { x: 10, y: 380 },
        { x: 10, y: 450 },
        { x: 10, y: 500 },
        { x: 10, y: 550 },
        { x: 10, y: 620 },
        { x: 10, y: 690 },
        { x: 50, y: 150 },
        { x: 60, y: 250 },
        { x: 120, y: 300 },
        { x: 100, y: 350 },
        { x: 90, y: 440 },
        { x: 80, y: 500 },
        { x: 90, y: 580 },
        { x: 80, y: 630 },
        { x: 120, y: 200 },
        { x: 150, y: 300 },
      ],
      startCorner: [0, 0],
    },
    {
      playerShapesPositions: [
        { x: 50, y: 10 },
        { x: 80, y: 10 },
        { x: 150, y: 10 },
        { x: 180, y: 10 },
        { x: 260, y: 10 },
        { x: 360, y: 10 },
        { x: 430, y: 10 },
        { x: 500, y: 10 },
        { x: 570, y: 10 },
        { x: 610, y: 10 },
        { x: 680, y: 10 },
        { x: 180, y: 80 },
        { x: 240, y: 80 },
        { x: 310, y: 80 },
        { x: 350, y: 80 },
        { x: 380, y: 80 },
        { x: 460, y: 80 },
        { x: 580, y: 80 },
        { x: 630, y: 80 },
        { x: 250, y: 140 },
        { x: 530, y: 80 },
      ],
      startCorner: [0, this.#COLS - 1],
    },
    {
      playerShapesPositions: [
        { x: 770, y: 50 },
        { x: 735, y: 70 },
        { x: 765, y: 140 },
        { x: 680, y: 110 },
        { x: 680, y: 180 },
        { x: 620, y: 210 },
        { x: 610, y: 280 },
        { x: 610, y: 330 },
        { x: 610, y: 390 },
        { x: 610, y: 460 },
        { x: 610, y: 530 },
        { x: 680, y: 230 },
        { x: 680, y: 330 },
        { x: 650, y: 390 },
        { x: 680, y: 390 },
        { x: 660, y: 490 },
        { x: 660, y: 560 },
        { x: 740, y: 270 },
        { x: 720, y: 380 },
        { x: 720, y: 450 },
        { x: 740, y: 600 },
      ],
      startCorner: [this.#ROWS - 1, this.#COLS - 1],
    },
    {
      playerShapesPositions: [
        { x: 40, y: 770 },
        { x: 80, y: 730 },
        { x: 150, y: 690 },
        { x: 180, y: 730 },
        { x: 250, y: 750 },
        { x: 340, y: 730 },
        { x: 410, y: 750 },
        { x: 480, y: 750 },
        { x: 550, y: 730 },
        { x: 580, y: 730 },
        { x: 650, y: 730 },
        { x: 180, y: 630 },
        { x: 240, y: 690 },
        { x: 240, y: 620 },
        { x: 580, y: 620 },
        { x: 360, y: 680 },
        { x: 400, y: 620 },
        { x: 450, y: 680 },
        { x: 500, y: 680 },
        { x: 500, y: 620 },
        { x: 310, y: 620 },
      ],
      startCorner: [this.#ROWS - 1, 0],
    },
  ];
  #PLAYERS_COLORS = ["red", "green", "yellow", "blue"];
  #COLS = 20;
  #ROWS = 20;

  board: CellsBoard | null;
  constructor(
    width: number,
    height: number,
    x: number,
    y: number,
    stage: GameStage
  ) {
    super(width, height, x, y, stage);
    this.board = null;
  }
  draw(players: Player[]) {
    this.stage.drawRect(
      "rgba(0, 0, 0, 0.5)",
      0,
      0,
      this.width,
      this.height,
      this.container
    );
    this.stage.drawLine(
      "white",
      0,
      0,
      this.width / 2 - (this.#COLS * this.stage.cellWidth) / 2,
      this.height / 2 - (this.#ROWS * this.stage.cellWidth) / 2,
      1,
      this.container
    );
    this.stage.drawLine(
      "white",
      this.width,
      0,
      this.width - (this.width / 2 - (this.#COLS * this.stage.cellWidth) / 2),
      this.height / 2 - (this.#ROWS * this.stage.cellWidth) / 2,
      1,
      this.container
    );
    this.stage.drawLine(
      "white",
      0,
      this.height,
      this.width / 2 - (this.#COLS * this.stage.cellWidth) / 2,
      this.height - (this.height / 2 - (this.#ROWS * this.stage.cellWidth) / 2),
      1,
      this.container
    );
    this.stage.drawLine(
      "white",
      this.width,
      this.height,
      this.width - (this.width / 2 - (this.#COLS * this.stage.cellWidth) / 2),
      this.height - (this.height / 2 - (this.#ROWS * this.stage.cellWidth) / 2),
      1,
      this.container
    );

    // board Container
    this.board = new CellsBoard(
      this.makeContainer(
        this.width / 2 - (this.#COLS * this.stage.cellWidth) / 2,
        this.height / 2 - (this.#ROWS * this.stage.cellWidth) / 2
      )
    );
    this.board.initialize(this.#COLS, this.#ROWS, this.stage);

    // allowed places per player
    const usedColors: string[] = [];
    const positions = this.#POSITIONS();

    for (let i = 0; i < this.#PLAYERS_COLORS.length; i++) {
      let randomColor =
        this.#PLAYERS_COLORS[
          Math.floor(Math.random() * this.#PLAYERS_COLORS.length)
        ];

      // generate random colors until find a color that is not used
      while (usedColors.includes(randomColor)) {
        randomColor =
          this.#PLAYERS_COLORS[
            Math.floor(Math.random() * this.#PLAYERS_COLORS.length)
          ];
      }

      usedColors.push(randomColor);

      this.board.matrix[positions[i].startCorner[0]][
        positions[i].startCorner[1]
      ].canPlace.push(randomColor);

      players[i].color = randomColor;
      this.drawPlayerShapes(positions[i].playerShapesPositions, players[i]);
    }
    this.stage.update();
  }
  drawPlayerShapes(
    positions: any[] /* ReturnType<typeof this.#POSITIONS> */,
    player: Player
  ) {
    for (let i = 1; i <= 21; i++) {
      const shape = new GameShape(i, this.stage, player);
      const canvasShape = shape.draw(positions[i - 1].x, positions[i - 1].y);

      shape.originalCanvasShape = canvasShape;
      this.container.addChild(canvasShape);
    }
  }
}
