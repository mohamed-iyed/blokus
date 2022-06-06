import { Container } from "createjs-module";
import Board from "./Board";
import Game from "./Game";
import GameStage from "./GameStage";
import Player from "./Player";
import GameShape from "./Shape";

export interface matrixCell {
  canPlace: any[];
  color: null | string;
  cell: Container;
  mouseOver: boolean;
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
        this.matrix[i].push({
          canPlace: [],
          color: null,
          cell,
          mouseOver: false,
        });
      }
    }
  }
  *[Symbol.iterator]() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        yield { coords: [i, j], boardCell: this.matrix[i][j] };
      }
    }
  }
}

// draw shape on hover
function drawOnHover(this: GameBoard, coords: number[]) {
  const [x, y] = coords;
  const startI = x - 2;
  const startJ = y - 2;

  if (this.game.controlBoard.activeShape) {
    if (this.game.controlBoard.activePlayer === this.game.me) {
      this.game.socket.emit("DRAW_ON_HOVER", coords, this.game.gameCode);
    }
    for (let i = 0; i < this.game.controlBoard.activeShape.matrix.length; i++) {
      for (
        let j = 0;
        j < this.game.controlBoard.activeShape.matrix[i].length;
        j++
      ) {
        if (
          this.game.controlBoard.activeShape.matrix[i][j] === 1 &&
          (!this.board.matrix[i + startI] ||
            !this.board.matrix[i + startI][j + startJ] ||
            this.board.matrix[i + startI][j + startJ].color ||
            // check right cell
            (this.board.matrix[i + startI][j + startJ + 1] &&
              this.board.matrix[i + startI][j + startJ + 1].color ===
                this.game.controlBoard.activePlayer.color) ||
            // check top cell
            (this.board.matrix[i + startI - 1] &&
              this.board.matrix[i + startI - 1][j + startJ] &&
              this.board.matrix[i + startI - 1][j + startJ].color ===
                this.game.controlBoard.activePlayer.color) ||
            // check left cell
            (this.board.matrix[i + startI][j + startJ - 1] &&
              this.board.matrix[i + startI][j + startJ - 1].color ===
                this.game.controlBoard.activePlayer.color) ||
            // check bottom cell
            (this.board.matrix[i + startI + 1] &&
              this.board.matrix[i + startI + 1][j + startJ] &&
              this.board.matrix[i + startI + 1][j + startJ].color ===
                this.game.controlBoard.activePlayer.color))
        ) {
          return;
        }
      }
    }

    for (let i = 0; i < this.game.controlBoard.activeShape.matrix.length; i++) {
      for (
        let j = 0;
        j < this.game.controlBoard.activeShape.matrix[i].length;
        j++
      ) {
        if (this.game.controlBoard.activeShape.matrix[i][j] === 1) {
          this.board.matrix[i + startI][j + startJ].mouseOver = true;
          this.board.matrix[i + startI][
            j + startJ
          ].cell.children[0].graphics._fill.style =
            this.game.controlBoard.activePlayer.color;

          this.stage.update();
        }
      }
    }
  }
}
// undraw shape on mouse out
function undrawOnOut(this: GameBoard, coords: number[]) {
  const [x, y] = coords;
  const startI = x - 2;
  const startJ = y - 2;

  if (this.game.controlBoard.activeShape) {
    if (this.game.controlBoard.activePlayer === this.game.me) {
      this.game.socket.emit("UNDRAW_ON_OUT", coords, this.game.gameCode);
    }
    for (let i = 0; i < this.game.controlBoard.activeShape.matrix.length; i++) {
      for (
        let j = 0;
        j < this.game.controlBoard.activeShape.matrix[i].length;
        j++
      ) {
        if (
          this.game.controlBoard.activeShape.matrix[i][j] === 1 &&
          this.board.matrix[i + startI] &&
          this.board.matrix[i + startI][j + startJ] &&
          this.board.matrix[i + startI][j + startJ].mouseOver
        ) {
          this.board.matrix[i + startI][
            j + startJ
          ].cell.children[0].graphics._fill.style = "#CCC";
          this.board.matrix[i + startI][j + startJ].mouseOver = false;
          this.stage.update();
        }
      }
    }
  }
}
// check if can place in cell
function canPlaceInZone(
  this: GameBoard,
  startI: number,
  startJ: number,
  color: string,
  matrix: number[][]
) {
  let hasColor = false;
  mainfor: for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (
        matrix[i][j] === 1 &&
        (!this.board.matrix[i + startI] ||
          !this.board.matrix[i + startI][j + startJ] ||
          this.board.matrix[i + startI][j + startJ].color ||
          // check right cell
          (this.board.matrix[i + startI][j + startJ + 1] &&
            this.board.matrix[i + startI][j + startJ + 1].color ===
              this.game.controlBoard.activePlayer.color) ||
          // check top cell
          (this.board.matrix[i + startI - 1] &&
            this.board.matrix[i + startI - 1][j + startJ] &&
            this.board.matrix[i + startI - 1][j + startJ].color ===
              this.game.controlBoard.activePlayer.color) ||
          // check left cell
          (this.board.matrix[i + startI][j + startJ - 1] &&
            this.board.matrix[i + startI][j + startJ - 1].color ===
              this.game.controlBoard.activePlayer.color) ||
          // check bottom cell
          (this.board.matrix[i + startI + 1] &&
            this.board.matrix[i + startI + 1][j + startJ] &&
            this.board.matrix[i + startI + 1][j + startJ].color ===
              this.game.controlBoard.activePlayer.color))
      ) {
        return false;
      }

      if (matrix[i][j] === 1) {
        if (
          this.board.matrix[i + startI][j + startJ].canPlace.includes(color)
        ) {
          hasColor = true;
        }
      }
    }
  }

  return hasColor;
}
// click on cell to place shape
function handleClick(this: GameBoard, coords: number[]) {
  const [x, y] = coords;
  const [startI, startJ] = [x - 2, y - 2];
  if (
    this.game.controlBoard.activeShape &&
    canPlaceInZone.call(
      this,
      startI,
      startJ,
      this.game.controlBoard.activePlayer.color,
      this.game.controlBoard.activeShape.matrix
    )
  ) {
    // string because of objects reference
    const toColorCellsCoords: string[] = [];

    for (let i = 0; i < this.game.controlBoard.activeShape.matrix.length; i++) {
      for (
        let j = 0;
        j < this.game.controlBoard.activeShape.matrix[i].length;
        j++
      ) {
        if (this.game.controlBoard.activeShape.matrix[i][j] === 1) {
          this.board.matrix[i + startI][j + startJ].color =
            this.game.controlBoard.activePlayer.color;
          toColorCellsCoords.push(`${i + startI}-${j + startJ}`);
        }
      }
    }
    // _this.container.elem.children.forEach((shape) => {
    //   const shapeCoords = `${shape.coords[0]}-${shape.coords[1]}`;
    //   if (coords.includes(shapeCoords)) {
    //     shape.mouseOver = false;
    //     shape.alpha = 1;
    //     shape.children[0].graphics._fill.style = _this.activePlayer.color;
    //     _this.board[shape.coords[0]][shape.coords[1]].color =
    //       _this.activePlayer.color;
    //     _this.board[shape.coords[0]][shape.coords[1]].canPlace = [];
    //     _this.updateStage();
    //   }
    // });

    for (const { coords, boardCell } of this.board) {
      const shapeCoords = `${coords[0]}-${coords[1]}`;
      if (toColorCellsCoords.includes(shapeCoords)) {
        boardCell.mouseOver = false;
        boardCell.cell.alpha = 1;
        boardCell.cell.children[0].graphics._fill.style =
          this.game.controlBoard.activePlayer.color;
        boardCell.color = this.game.controlBoard.activePlayer.color;
        boardCell.canPlace = [];
        this.stage.update();
      }
    }

    // update matrix after placing the shape
    for (let i = 0; i < this.board.matrix.length; i++) {
      for (let j = 0; j < this.board.matrix[i].length; j++) {
        const cell = this.board.matrix[i][j];
        if (cell.color) {
          let leftCell, topCell, rightCell, bottomCell;
          leftCell = this.board.matrix[i][j - 1]
            ? this.board.matrix[i][j - 1]
            : null;
          topCell =
            this.board.matrix[i - 1] && this.board.matrix[i - 1][j]
              ? this.board.matrix[i - 1][j]
              : null;
          rightCell = this.board.matrix[i][j + 1]
            ? this.board.matrix[i][j + 1]
            : null;
          bottomCell =
            this.board.matrix[i + 1] && this.board.matrix[i + 1][j]
              ? this.board.matrix[i + 1][j]
              : null;

          let topLeftCorner = { coords: [i - 1, j - 1], canPlace: true },
            topRightCorner = { coords: [i - 1, j + 1], canPlace: true },
            bottomRightCorner = { coords: [i + 1, j + 1], canPlace: true },
            bottomLeftCorner = { coords: [i + 1, j - 1], canPlace: true };

          if (
            !(this.board.matrix[i - 1] && this.board.matrix[i - 1][j - 1]) ||
            (leftCell && leftCell.color === cell.color) ||
            (topCell && topCell.color === cell.color)
          ) {
            topLeftCorner.canPlace = false;
          }
          if (
            !(this.board.matrix[i - 1] && this.board.matrix[i - 1][j + 1]) ||
            (topCell && topCell.color === cell.color) ||
            (rightCell && rightCell.color === cell.color)
          ) {
            topRightCorner.canPlace = false;
          }
          if (
            !(this.board.matrix[i + 1] && this.board.matrix[i + 1][j + 1]) ||
            (rightCell && rightCell.color === cell.color) ||
            (bottomCell && bottomCell.color === cell.color)
          ) {
            bottomRightCorner.canPlace = false;
          }
          if (
            !(this.board.matrix[i + 1] && this.board.matrix[i + 1][j - 1]) ||
            (bottomCell && bottomCell.color === cell.color) ||
            (leftCell && leftCell.color === cell.color)
          ) {
            bottomLeftCorner.canPlace = false;
          }

          if (topLeftCorner.canPlace) {
            this.board.matrix[topLeftCorner.coords[0]][
              topLeftCorner.coords[1]
            ].canPlace.push(cell.color);
          }
          if (topRightCorner.canPlace) {
            this.board.matrix[topRightCorner.coords[0]][
              topRightCorner.coords[1]
            ].canPlace.push(cell.color);
          }
          if (bottomRightCorner.canPlace) {
            this.board.matrix[bottomRightCorner.coords[0]][
              bottomRightCorner.coords[1]
            ].canPlace.push(cell.color);
          }
          if (bottomLeftCorner.canPlace) {
            this.board.matrix[bottomLeftCorner.coords[0]][
              bottomLeftCorner.coords[1]
            ].canPlace.push(cell.color);
          }
        }
      }
    }
    // update score
    // const score = _this.stage.children.find(
    //   (elem) =>
    //     elem.name ===
    //     `score${
    //       _this.activePlayer.color.charAt(0).toUpperCase() +
    //       _this.activePlayer.color.slice(1)
    //     }`
    // );

    // const scoreNum =
    //   +score.text +
    //   _this.activeShape.matrix.reduce((acc, elem) => {
    //     return acc + elem.filter((e) => e === 1).length;
    //   }, 0);

    // score.text = scoreNum;
    // _this.updateStage();

    // removing the shape from the board
    if (
      this.game.controlBoard.activeShape &&
      this.game.controlBoard.activeShape.originalCanvasShape &&
      this.game.controlBoard.activeShape.originalCanvasShape.parent
    ) {
      const parent =
        this.game.controlBoard.activeShape.originalCanvasShape.parent;
      parent.removeChild(
        this.game.controlBoard.activeShape.originalCanvasShape
      );
    }

    //  remove shape from the player
    this.game.controlBoard.activePlayer.shapes =
      this.game.controlBoard.activePlayer.shapes.filter(
        (shape: GameShape) => shape !== this.game.controlBoard.activeShape
      );

    // if (this.game.controlBoard.activePlayer.shapes.length === 0) {
    //   _this.end();
    // }
    // this.activeShape = null;
    // _this.originalActiveShape = null;
    // // moving to the next player
    // _this.timeLeft = 0;
    // if active player is bot
    return true;
  } else {
    return false;
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

  board: CellsBoard;
  boardContainer: Container;
  constructor(
    width: number,
    height: number,
    x: number,
    y: number,
    stage: GameStage,
    game: Game
  ) {
    super(width, height, x, y, stage, game);
    this.boardContainer = this.makeContainer(
      this.width / 2 - (this.#COLS * this.stage.cellWidth) / 2,
      this.height / 2 - (this.#ROWS * this.stage.cellWidth) / 2
    );

    this.board = new CellsBoard(this.boardContainer);
    // handle draw on hover
    this.game.socket.on("DRAW_ON_HOVER", (coords: number[]) => {
      if (this.game.controlBoard.activePlayer !== this.game.me) {
        drawOnHover.call(this, coords);
      }
    });
    // handle undraw shape on out
    this.game.socket.on("UNDRAW_ON_OUT", (coords: number[]) => {
      if (this.game.controlBoard.activePlayer !== this.game.me) {
        undrawOnOut.call(this, coords);
      }
    });
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
    this.container.setChildIndex(
      this.boardContainer,
      this.container.children.length - 1
    );
    this.board.initialize(this.#COLS, this.#ROWS, this.stage);

    // allowed places per player
    const positions = this.#POSITIONS();

    for (let i = 0; i < this.#PLAYERS_COLORS.length; i++) {
      this.board.matrix[positions[i].startCorner[0]][
        positions[i].startCorner[1]
      ].canPlace.push(players[i].color);

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
  enable(player: Player) {
    // add event listeners to the player shapes
    player.shapes.forEach((shape) => {
      const canvasShape = shape.canvasShape;
      if (canvasShape) {
        canvasShape.cursor = "pointer";
        canvasShape.on("click", () => {
          this.game.controlBoard.activeShape = shape;
          this.game.socket.emit(
            "ACTIVE_SHAPE",
            shape.number,
            this.game.gameCode
          );
        });
        this.stage.update();
      }
    });
    // allow show shape on hover
    if (this.board && this.game.controlBoard.activePlayer === this.game.me) {
      for (const { coords, boardCell } of this.board) {
        // remove color from mouse overed cells from board
        if (boardCell.mouseOver) {
          boardCell.cell.cursor = "default";
          boardCell.cell.children[0].graphics._fill.style = "#CCC";
          boardCell.mouseOver = false;
        }
        boardCell.cell.cursor = "pointer";
        boardCell.cell.addEventListener(
          "mouseover",
          drawOnHover.bind(this, coords)
        );
        boardCell.cell.addEventListener(
          "mouseout",
          undrawOnOut.bind(this, coords)
        );
        boardCell.cell.addEventListener(
          "click",
          handleClick.bind(this, coords)
        );
        this.stage.update();
      }
    }
  }
  disable() {
    // remove all event listeners from all shapes
    this.game.players.forEach((player) => {
      player.shapes.forEach((shape) => {
        const canvasShape = shape.canvasShape;
        if (canvasShape) {
          canvasShape.cursor = "default";
          canvasShape.removeAllEventListeners("click");
          this.stage.update();
        }
      });
    });
    // remove color from mouse overed cells from board
    for (const { boardCell } of this.board) {
      if (boardCell.mouseOver) {
        boardCell.cell.children[0].graphics._fill.style = "#CCC";
        boardCell.mouseOver = false;
      }
      // remove all events from cells
      boardCell.cell.cursor = "default";
      boardCell.cell.removeAllEventListeners("mouseover");
      boardCell.cell.removeAllEventListeners("mouseout");
      boardCell.cell.removeAllEventListeners("click");
      this.stage.update();
    }
  }
}
