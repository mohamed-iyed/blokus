import { Container } from "@createjs/easeljs";
import Board from "./Board";

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
        { x: 540, y: 80 },
        { x: 600, y: 80 },
        { x: 250, y: 140 },
      ],
      startCorner: [0, this.COLS - 1],
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
      ],
      startCorner: [this.ROWS - 1, this.COLS - 1],
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
        { x: 320, y: 620 },
        { x: 360, y: 680 },
        { x: 400, y: 620 },
        { x: 450, y: 680 },
        { x: 500, y: 680 },
        { x: 500, y: 620 },
      ],
      startCorner: [this.ROWS - 1, 0],
    },
  ];
  #PLAYERS_COLORS = ["red", "green", "yellow", "blue"];

  constructor(COLS, ROWS, stage) {
    // 200 200 makes the board in the middle
    super(200, 200, stage);
    this.COLS = COLS;
    this.ROWS = ROWS;
    // board matrix
    this.board = [];
  }

  draw() {
    this.stage.drawRect(
      "rgba(0, 0, 0, 0.5)",
      0,
      0,
      this.stage.canvas.width,
      this.stage.canvas.height
    );
    this.stage.drawLine("white", 0, 0, 200, 200, 1);
    this.stage.drawLine(
      "white",
      this.stage.canvas.width,
      0,
      this.stage.canvas.width - 200,
      200,
      1
    );
    this.stage.drawLine(
      "white",
      0,
      this.stage.canvas.height,
      200,
      this.stage.canvas.height - 200,
      1
    );
    this.stage.drawLine(
      "white",
      this.stage.canvas.width,
      this.stage.canvas.height,
      this.stage.canvas.width - 200,
      this.stage.canvas.height - 200,
      1
    );
    // this.stage.addText(
    //   "red" + " !",
    //   "30px sans-serif",
    //   "red",
    //   "center",
    //   1000,
    //   425,
    //   "activePlayerColor"
    // );     controll board

    // intilize the board
    for (let i = 0; i < this.ROWS; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.COLS; j++) {
        this.board[i].push({ canPlace: [], color: null });
        // make a board cell
        const cell = this.makeContainer(
          j * this.container.COLS,
          i * this.container.ROWS
        );
        cell.coords = [i, j];
        this.stage.drawRect("#CCC", 0, 0, this.ROWS, this.COLS, cell);
      }
    }

    // allowed places per player
    const usedColors = [];
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

      this.board[this.#POSITIONS[i].startCorner[0]][
        this.#POSITIONS[i].startCorner[1]
      ].canPlace.push(randomColor);
    }
    this.stage.update();
  }
}
