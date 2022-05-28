import {
  Stage,
  Shape,
  Graphics,
  Text,
  Container,
  Bitmap,
} from "@createjs/easeljs";
import Player from "./Player";
import sleep from "../utils/sleep";

const ONE_SECOND = 1000;
const POSITIONS = {
  red: [
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
  green: [
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
  yellow: [
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
  blue: [
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
};
const MAX_PLAY_TIME = 30; // 30 second

// can place shape in position
function canPlaceInZone(context, startI, startJ, color, matrix) {
  let hasColor = false;
  const _this = context;
  mainfor: for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (
        matrix[i][j] === 1 &&
        (!_this.board[i + startI] ||
          !_this.board[i + startI][j + startJ] ||
          _this.board[i + startI][j + startJ].color ||
          // check right cell
          (_this.board[i + startI][j + startJ + 1] &&
            _this.board[i + startI][j + startJ + 1].color ===
              _this.activePlayer.color) ||
          // check top cell
          (_this.board[i + startI - 1] &&
            _this.board[i + startI - 1][j + startJ] &&
            _this.board[i + startI - 1][j + startJ].color ===
              _this.activePlayer.color) ||
          // check left cell
          (_this.board[i + startI][j + startJ - 1] &&
            _this.board[i + startI][j + startJ - 1].color ===
              _this.activePlayer.color) ||
          // check bottom cell
          (_this.board[i + startI + 1] &&
            _this.board[i + startI + 1][j + startJ] &&
            _this.board[i + startI + 1][j + startJ].color ===
              _this.activePlayer.color))
      ) {
        return false;
      }

      if (matrix[i][j] === 1) {
        if (_this.board[i + startI][j + startJ].canPlace.includes(color)) {
          hasColor = true;
        }
      }
    }
  }

  return hasColor;
}
// darw shape on hover
function drawOnHover(e) {
  const _this = e.currentTarget.context;
  const [x, y] = e.currentTarget.coords;
  const startI = x - 2;
  const startJ = y - 2;

  if (_this._activeShape) {
    for (let i = 0; i < _this.activeShape.matrix.length; i++) {
      for (let j = 0; j < _this.activeShape.matrix[i].length; j++) {
        if (
          _this.activeShape.matrix[i][j] === 1 &&
          (!_this.board[i + startI] ||
            !_this.board[i + startI][j + startJ] ||
            _this.board[i + startI][j + startJ].color ||
            // check right cell
            (_this.board[i + startI][j + startJ + 1] &&
              _this.board[i + startI][j + startJ + 1].color ===
                _this.activePlayer.color) ||
            // check top cell
            (_this.board[i + startI - 1] &&
              _this.board[i + startI - 1][j + startJ] &&
              _this.board[i + startI - 1][j + startJ].color ===
                _this.activePlayer.color) ||
            // check left cell
            (_this.board[i + startI][j + startJ - 1] &&
              _this.board[i + startI][j + startJ - 1].color ===
                _this.activePlayer.color) ||
            // check bottom cell
            (_this.board[i + startI + 1] &&
              _this.board[i + startI + 1][j + startJ] &&
              _this.board[i + startI + 1][j + startJ].color ===
                _this.activePlayer.color))
        ) {
          return;
        }
      }
    }

    for (let i = 0; i < _this.activeShape.matrix.length; i++) {
      for (let j = 0; j < _this.activeShape.matrix[i].length; j++) {
        if (_this.activeShape.matrix[i][j] === 1) {
          const shape = _this.container.elem.children.find(
            (elem) =>
              elem.coords[0] === i + startI && elem.coords[1] === j + startJ
          );
          shape.mouseOver = true;
          shape.children[0].graphics._fill.style = _this.activePlayer.color;
          _this.updateStage();
        }
      }
    }
  }
}
// undraw shape on mouse out
function undrawOnOut(e) {
  const _this = e.currentTarget.context;
  _this.container.elem.children.forEach((elem) => {
    if (elem.mouseOver) {
      elem.children[0].graphics._fill.style = "#CCC";
      elem.mouseOver = false;
      _this.updateStage();
    }
  });
}
// add click event to board shapes to allow placing an element
function handleClick(e) {
  const _this = e.currentTarget.context;
  const [x, y] = e.currentTarget.coords;
  const [startI, startJ] = [x - 2, y - 2];

  if (
    _this.activeShape &&
    canPlaceInZone(
      _this,
      startI,
      startJ,
      _this.activePlayer.color,
      _this.activeShape.matrix
    )
  ) {
    const coords = [];
    for (let i = 0; i < _this.activeShape.matrix.length; i++) {
      for (let j = 0; j < _this.activeShape.matrix[i].length; j++) {
        if (_this.activeShape.matrix[i][j] === 1) {
          _this.board[i + startI][j + startJ].color = _this.activePlayer.color;
          coords.push(`${i + startI}-${j + startJ}`);
        }
      }
    }
    _this.container.elem.children.forEach((shape) => {
      const shapeCoords = `${shape.coords[0]}-${shape.coords[1]}`;
      if (coords.includes(shapeCoords)) {
        shape.mouseOver = false;
        shape.alpha = 1;
        shape.children[0].graphics._fill.style = _this.activePlayer.color;
        _this.board[shape.coords[0]][shape.coords[1]].color =
          _this.activePlayer.color;
        _this.board[shape.coords[0]][shape.coords[1]].canPlace = [];
        _this.updateStage();
      }
    });
    // update matrix after placing the shape
    for (let i = 0; i < _this.board.length; i++) {
      for (let j = 0; j < _this.board[i].length; j++) {
        const cell = _this.board[i][j];
        if (cell.color) {
          let leftCell, topCell, rightCell, bottomCell;
          leftCell = _this.board[i][j - 1] ? _this.board[i][j - 1] : null;
          topCell =
            _this.board[i - 1] && _this.board[i - 1][j]
              ? _this.board[i - 1][j]
              : null;
          rightCell = _this.board[i][j + 1] ? _this.board[i][j + 1] : null;
          bottomCell =
            _this.board[i + 1] && _this.board[i + 1][j]
              ? _this.board[i + 1][j]
              : null;

          let topLeftCorner = { coords: [i - 1, j - 1], canPlace: true },
            topRightCorner = { coords: [i - 1, j + 1], canPlace: true },
            bottomRightCorner = { coords: [i + 1, j + 1], canPlace: true },
            bottomLeftCorner = { coords: [i + 1, j - 1], canPlace: true };

          if (
            !(_this.board[i - 1] && _this.board[i - 1][j - 1]) ||
            (leftCell && leftCell.color === cell.color) ||
            (topCell && topCell.color === cell.color)
          ) {
            topLeftCorner.canPlace = false;
          }
          if (
            !(_this.board[i - 1] && _this.board[i - 1][j + 1]) ||
            (topCell && topCell.color === cell.color) ||
            (rightCell && rightCell.color === cell.color)
          ) {
            topRightCorner.canPlace = false;
          }
          if (
            !(_this.board[i + 1] && _this.board[i + 1][j + 1]) ||
            (rightCell && rightCell.color === cell.color) ||
            (bottomCell && bottomCell.color === cell.color)
          ) {
            bottomRightCorner.canPlace = false;
          }
          if (
            !(_this.board[i + 1] && _this.board[i + 1][j - 1]) ||
            (bottomCell && bottomCell.color === cell.color) ||
            (leftCell && leftCell.color === cell.color)
          ) {
            bottomLeftCorner.canPlace = false;
          }

          if (topLeftCorner.canPlace) {
            _this.board[topLeftCorner.coords[0]][
              topLeftCorner.coords[1]
            ].canPlace.push(cell.color);
          }
          if (topRightCorner.canPlace) {
            _this.board[topRightCorner.coords[0]][
              topRightCorner.coords[1]
            ].canPlace.push(cell.color);
          }
          if (bottomRightCorner.canPlace) {
            _this.board[bottomRightCorner.coords[0]][
              bottomRightCorner.coords[1]
            ].canPlace.push(cell.color);
          }
          if (bottomLeftCorner.canPlace) {
            _this.board[bottomLeftCorner.coords[0]][
              bottomLeftCorner.coords[1]
            ].canPlace.push(cell.color);
          }
        }
      }
    }
    // update score
    const score = _this.stage.children.find(
      (elem) =>
        elem.name ===
        `score${
          _this.activePlayer.color.charAt(0).toUpperCase() +
          _this.activePlayer.color.slice(1)
        }`
    );

    const scoreNum =
      +score.text +
      _this.activeShape.matrix.reduce((acc, elem) => {
        return acc + elem.filter((e) => e === 1).length;
      }, 0);

    score.text = scoreNum;
    _this.updateStage();

    // removing the shape from the board
    if (_this.originalActiveShape && _this.originalActiveShape.parent) {
      const parent = _this.originalActiveShape.parent;
      parent.removeChild(_this.originalActiveShape);
    }

    //  remove shape from the player
    _this.activeShape.player.shapes = _this.activeShape.player.shapes.filter(
      (shape) => shape !== _this.activeShape
    );

    if (_this.activeShape.player.shapes.length === 0) {
      _this.end();
    }
    _this.activeShape = null;
    _this.originalActiveShape = null;
    // moving to the next player
    _this.timeLeft = 0;
    // if active player is bot
    return true;
  } else {
    return false;
  }
}
export default class Game {
  constructor(canvas, width, height) {
    this.canvas = {
      elem: canvas,
      width,
      height,
    };
    this.canvas.elem.getContext("2d").scale(20, 20);
    this.stage = new Stage(canvas);
    this.stage.enableMouseOver();
    this.container = {
      elem: new Container(),
      COLS: 20,
      ROWS: 20,
    };
    this.players = [];
  }

  // start the game
  start(activePlayers) {
    this._activePlayers = activePlayers;
    this.drawRect(
      "rgba(0, 0, 0, 0.5)",
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.drawLine("white", 0, 0, 200, 200, 1);
    this.drawLine(
      "white",
      this.canvas.width,
      0,
      this.canvas.width - 200,
      200,
      1
    );
    this.drawLine(
      "white",
      0,
      this.canvas.height,
      200,
      this.canvas.height - 200,
      1
    );
    this.drawLine(
      "white",
      this.canvas.width,
      this.canvas.height,
      this.canvas.width - 200,
      this.canvas.height - 200,
      1
    );
    this.addText(
      "red" + " !",
      "30px sans-serif",
      "red",
      "center",
      1000,
      425,
      "activePlayerColor"
    );
    // players shapes
    activePlayers.forEach(({ color, type }) => {
      const newPlayer = new Player(color, type).drawShapes(
        this,
        POSITIONS[color]
      );
      this.players.push(newPlayer);
    });

    // make game grid
    this.makeGrid();

    // make the control board
    const controlBoardContainer = new Container();
    this.controlBoardContainer = controlBoardContainer;
    controlBoardContainer.set({
      x: 800,
      y: 0,
    });

    this.stage.addChild(controlBoardContainer);
    // the background for the control board
    this.drawRect("#FAFAFA", 0, 0, 400, 800, controlBoardContainer);
    // show the active shape
    this.drawRect("#F5F5F5", 25, 20, 350, 300, controlBoardContainer);
    this.addText(
      "ACTIVE SHAPE",
      "bold 30px Arial",
      "#555555",
      "center",
      1000,
      45
    );
    // active shape
    const activeShapeContainer = new Container();
    this.drawRect("#FEFEFE", 0, 0, 300, 200, activeShapeContainer);
    activeShapeContainer.set({
      x: 50,
      y: 100,
    });
    activeShapeContainer.name = "activeShapeContainer";
    this.controlBoardContainer.addChild(activeShapeContainer);
    // add the control active shape icons
    this.addImage(
      30,
      30,
      "rotate360.svg",
      190,
      70,
      this.controlBoardContainer,
      "click",
      () => {
        this.activeShape = _this.activeShape?.flip();
      }
    );
    this.addImage(
      30,
      30,
      "rotate90left.svg",
      220,
      70,
      this.controlBoardContainer,
      "click",
      () => {
        this.activeShape = _this.activeShape?.rotateLeft();
      }
    );
    this.addImage(
      30,
      30,
      "rotate90right.svg",
      160,
      70,
      this.controlBoardContainer,
      "click",
      () => {
        this.activeShape = _this.activeShape?.rotateRight();
      }
    );

    // current Player
    const currentPlayerContainer = new Container();
    currentPlayerContainer.set({
      x: 50,
      y: 370,
    });

    this.drawRect("#CCC", 0, 0, 300, 70, currentPlayerContainer);
    this.addText(
      "current Player :",
      "bold 20px sans-serif",
      "#242424",
      "center",
      1000,
      390
    );

    this.controlBoardContainer.addChild(currentPlayerContainer);
    // time left
    const timeLeftContainer = new Container();
    timeLeftContainer.set({
      x: 150,
      y: 330,
    });
    this.drawRect("#CCC", 0, 0, 100, 30, timeLeftContainer);
    this.addText("20", "16px Arial", "black", "center", 990, 345, "timeLeft");

    this.timeLeft = 0;
    // player turns
    const _this = this;
    let i = 0;

    function nextPlayer() {
      if (_this.timeLeft === 0) {
        _this.timeLeft = MAX_PLAY_TIME;
        _this.activePlayer = _this.players[i++];
        _this.activeShape = null;
        _this.updateStage();
        if (i === _this.players.length) {
          i = 0;
        }
      }
      _this.timeLeft = --_this.timeLeft;
    }
    nextPlayer();

    this.gameTimer = setInterval(nextPlayer, ONE_SECOND);
    this.controlBoardContainer.addChild(timeLeftContainer);

    // scores
    const scoreContainer1 = new Container();

    this.drawRect("red", 25, 450, 150, 70, scoreContainer1);
    this.addText("score : ", "bold 20px Arial", "white", "center", 900, 470);
    this.addText("0", "16px Arial", "white", "center", 900, 500, "scoreRed");
    this.controlBoardContainer.addChild(scoreContainer1);

    const scoreContainer2 = new Container();

    this.drawRect("blue", 200, 450, 150, 70, scoreContainer2);
    this.addText("score : ", "bold 20px Arial", "white", "center", 1070, 470);
    this.addText("0", "16px Arial", "white", "center", 1070, 500, "scoreBlue");
    this.controlBoardContainer.addChild(scoreContainer2);

    const scoreContainer3 = new Container();

    this.drawRect("green", 25, 550, 150, 70, scoreContainer3);
    this.addText("score : ", "bold 20px Arial", "white", "center", 900, 570);
    this.addText("0", "16px Arial", "white", "center", 900, 600, "scoreGreen");
    this.controlBoardContainer.addChild(scoreContainer3);

    const scoreContainer4 = new Container();

    this.drawRect("#F7D455", 200, 550, 150, 70, scoreContainer4);
    this.addText("score : ", "bold 20px Arial", "white", "center", 1070, 570);
    this.addText(
      "0",
      "16px Arial",
      "white",
      "center",
      1070,
      600,
      "scoreYellow"
    );
    this.controlBoardContainer.addChild(scoreContainer4);

    // skip turn btn
    const skipTurnBtn = new Container();
    this.drawRect("#CCC", 0, 0, 160, 50, skipTurnBtn);
    this.addText("skip turn", "bold 24px Arial", "#F63", "center", 1070, 665);
    skipTurnBtn.set({
      x: 195,
      y: 640,
      cursor: "pointer",
    });
    const skipTurnListener = function () {
      _this.timeLeft = 0;
    };

    skipTurnBtn.on("click", skipTurnListener);
    this.controlBoardContainer.addChild(skipTurnBtn);
    // restart the game btn
    const restartBtn = new Container();
    this.drawRect("#CCC", 0, 0, 190, 50, restartBtn);
    this.addText("Restart Game", "bold 24px Arial", "#F63", "center", 920, 725);
    restartBtn.set({
      x: 20,
      y: 700,
      cursor: "pointer",
    });
    restartBtn.on("click", function () {
      _this.stage.removeAllChildren();
      _this.updateStage();

      clearInterval(_this.gameTimer);
      _this.addText(
        "starting new Game ...",
        "bold 36px Arial",
        "black",
        "center",
        600,
        400,
        "newGame"
      );
      setTimeout(() => {
        _this.players = [];
        _this.container.elem = new Container();
        _this.start(_this._activePlayers);
        _this.updateStage();
        const newGameText = _this.stage.children.find(
          (elem) => elem.name === "newGame"
        );
        _this.stage.removeChild(newGameText);
      }, 200);
    });
    this.controlBoardContainer.addChild(restartBtn);
    // done btn
    const doneBtn = new Container();
    doneBtn.name = "doneBtn";
    doneBtn.set({
      x: 230,
      y: 700,
      cursor: "pointer",
    });
    doneBtn.on("click", function () {
      if (_this.players.length !== 1) {
        _this.players.splice(_this.players.indexOf(_this.activePlayer), 1);
      } else {
        return _this.end();
      }
      i = 0;
      _this.timeLeft = 0;
    });
    this.drawRect("#CCC", 0, 0, 125, 50, doneBtn);
    this.addText("Done", "bold 24px Arial", "#F63", "center", 1090, 725);
    this.controlBoardContainer.addChild(doneBtn);
    // end game btn
    const endGameBtn = new Container();
    this.drawRect("#CCC", 0, 0, 160, 50, endGameBtn);
    this.addText("End Game", "bold 24px Arial", "#F63", "center", 900, 665);
    endGameBtn.set({
      x: 20,
      y: 640,
      cursor: "pointer",
    });
    endGameBtn.on(
      "click",
      function () {
        _this.end();
        skipTurnBtn.removeAllEventListeners("click");
      },
      null,
      true
    );
    this.controlBoardContainer.addChild(endGameBtn);
    this.updateStage();
  }
  // add image to the canvas
  addImage(width, height, src, x, y, container = null, event, handler) {
    const image = new Image(width, height);
    image.src = `./src/${src}`;
    image.onload = handleLoad;
    const _this = this;

    function handleLoad(evt) {
      const image = evt.target;
      const bitmap = new Bitmap(image);
      const imgContainer = new Container();
      _this.drawRect("white", -3, -3, 30, 30, imgContainer);
      imgContainer.addChild(bitmap);
      imgContainer.set({
        x,
        y,
      });
      if (event && handler) {
        imgContainer.on(event, handler);
        imgContainer.cursor = "pointer";
      }

      if (container) {
        container.addChild(imgContainer);
      }
      _this.updateStage();
    }
  }
  // active player
  get activePlayer() {
    return this._activePlayer;
  }
  set activePlayer(newActivePlayer) {
    this._activePlayer = newActivePlayer;

    const allShapes = this.players.reduce(
      (shapes, player) => [...shapes, ...player.shapes],
      []
    );

    if (!this.activePlayer) {
      allShapes.forEach((shape) => {
        const canvasShape = shape.canvasShape;
        canvasShape.cursor = "default";
        canvasShape._listeners = null;
      });
      return;
    }
    const activePlayerColor = this.stage.children.find(
      (elem) => elem.name === "activePlayerColor"
    );

    // change active player text
    this.stage.setChildIndex(activePlayerColor, this.stage.children.length - 1);

    activePlayerColor.text = `${newActivePlayer.color} !`;
    activePlayerColor.color = newActivePlayer.color;

    // remove cursor pointer from all shapes

    allShapes.forEach((shape) => {
      const canvasShape = shape.canvasShape;
      canvasShape.cursor = "default";
      canvasShape._listeners = null;
    });

    // get all players shapes
    const playerShapes = newActivePlayer.shapes;

    const _this = this;
    if (this.activePlayer.type === "human") {
      // make shapes clickable for human players
      playerShapes.forEach((shape) => {
        const canvasShape = shape.canvasShape;
        canvasShape.cursor = "pointer";
        canvasShape.on("click", function () {
          _this.activeShape = shape;
          _this.updateStage();
        });
      });
      // draw can place zones in the board
      this.container.elem.children.forEach((elem) => {
        if (elem.canPlaceZone) {
          elem.canPlaceZone = false;
          elem.alpha = 1;
          elem.children[0].graphics._fill.style = _this.board[elem.coords[0]][
            elem.coords[1]
          ].color
            ? _this.board[elem.coords[0]][elem.coords[1]].color
            : "#CCC";
        }
      });
      for (let i = 0; i < this.board.length; i++) {
        for (let j = 0; j < this.board[i].length; j++) {
          if (
            this.board[i][j].canPlace.includes(this.activePlayer.color) &&
            !this.board[i][j].color
          ) {
            if (
              (this.board[i][j + 1] &&
                this.board[i][j + 1].color === this.activePlayer.color) ||
              (this.board[i][j - 1] &&
                this.board[i][j - 1].color === this.activePlayer.color) ||
              (this.board[i - 1] &&
                this.board[i - 1][j] &&
                this.board[i - 1][j].color === this.activePlayer.color) ||
              (this.board[i + 1] &&
                this.board[i + 1][j] &&
                this.board[i + 1][j].color === this.activePlayer.color)
            ) {
              continue;
            }
            // find container with the given coords
            const container = this.container.elem.children.find(
              (elem) => elem.coords[0] === i && elem.coords[1] === j
            );
            container.canPlaceZone = true;
            container.alpha = 0.2;
            container.children[0].graphics._fill.style =
              this.activePlayer.color;
          }
        }
      }
    } else {
      // remove can place zones of the previous player
      this.container.elem.children.forEach((elem) => {
        if (elem.canPlaceZone) {
          elem.canPlaceZone = false;
          elem.alpha = 1;
          elem.children[0].graphics._fill.style = _this.board[elem.coords[0]][
            elem.coords[1]
          ].color
            ? _this.board[elem.coords[0]][elem.coords[1]].color
            : "#CCC";
        }
      });
      sleep(200).then(() => {
        // pick a random shape
        let triedShapes = [];
        let placed = false;
        mainLoop: while (!placed && _this?.activePlayer?.shapes?.length !== 0) {
          console.log("try");
          if (triedShapes.length === _this.activePlayer.shapes.length) {
            const doneBtn = _this.controlBoardContainer.children.find(
              (elem) => elem.name === "doneBtn"
            );
            doneBtn.dispatchEvent("click");

            break mainLoop;
          }

          const shape =
            _this.activePlayer.shapes[
              Math.floor(Math.random() * _this.activePlayer.shapes.length)
            ];
          if (!triedShapes.includes(shape)) {
            triedShapes.push(shape);
          }

          _this.activeShape = shape;
          for (let i = 0; i < _this.board.length; i++) {
            for (let j = 0; j < _this.board[i].length; j++) {
              if (
                handleClick({
                  currentTarget: { context: _this, coords: [i, j] },
                })
              ) {
                placed = true;
                break mainLoop;
              }
            }
          }
          for (let k = 0; k < 3; k++) {
            _this.activeShape = shape.rotateLeft();
            for (let i = 0; i < _this.board.length; i++) {
              for (let j = 0; j < _this.board[i].length; j++) {
                if (
                  handleClick({
                    currentTarget: { context: _this, coords: [i, j] },
                  })
                ) {
                  placed = true;
                  break mainLoop;
                }
              }
            }
          }
          _this.activeShape = shape.rotateLeft();
          for (let k = 0; k < 3; k++) {
            _this.activeShape = shape.rotateRight();
            for (let i = 0; i < _this.board.length; i++) {
              for (let j = 0; j < _this.board[i].length; j++) {
                if (
                  handleClick({
                    currentTarget: { context: _this, coords: [i, j] },
                  })
                ) {
                  placed = true;
                  break mainLoop;
                }
              }
            }
          }
          _this.activeShape = shape.rotateRight().flip();
          for (let i = 0; i < _this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
              if (
                handleClick({
                  currentTarget: { context: this, coords: [i, j] },
                })
              ) {
                placed = true;
                break mainLoop;
              }
            }
          }
        }
      });
    }

    this.updateStage();
  }
  // original active shape
  get originalActiveShape() {
    return this._originalActiveShape;
  }
  set originalActiveShape(newOriginalActiveShape) {
    this._originalActiveShape = newOriginalActiveShape;
  }
  // active shape
  get activeShape() {
    return this._activeShape;
  }
  set activeShape(newActiveShape) {
    const _this = this;

    const activeShapeContainer = this.controlBoardContainer.children.find(
      (elem) => elem.name === "activeShapeContainer"
    );

    if (!newActiveShape) {
      activeShapeContainer.children = activeShapeContainer.children.filter(
        (elem) => elem.constructor.name === "Shape"
      );

      this._activeShape = null;
      this.originalActiveShape = null;

      this.container.elem.children.forEach((elem) => {
        elem.cursor = "default";
        elem.removeAllEventListeners("click");
        elem.removeAllEventListeners("mouseover");
        elem.removeAllEventListeners("mouseout");
      });
      return undrawOnOut({ currentTarget: { context: this } });
    }

    if (newActiveShape.canvasShape.parent === this.stage) {
      this.originalActiveShape = newActiveShape.canvasShape;
    }

    this._activeShape = newActiveShape;

    const activeShapeClone = this.activeShape.canvasShape.clone(true);

    activeShapeClone.set({
      x: 120,
      y: 70,
    });

    activeShapeContainer.children = activeShapeContainer.children.filter(
      (elem) => elem.constructor.name === "Shape"
    );

    activeShapeContainer.addChild(activeShapeClone);

    this.container.elem.children.forEach((elem) => {
      elem.context = _this;
      elem.cursor = "pointer";
      elem.addEventListener("click", handleClick);
      elem.addEventListener("mouseover", drawOnHover);
      elem.addEventListener("mouseout", undrawOnOut);
    });
    this.updateStage();
  }
  // time Left
  get timeLeft() {
    return this._timeLeft;
  }
  set timeLeft(newTimeLeft) {
    this._timeLeft = newTimeLeft;
    const timeLeftText = this.stage.children.find(
      (elem) => elem.name === "timeLeft"
    );
    timeLeftText.text = this.timeLeft;

    this.updateStage();
  }
  // make game grid
  makeGrid() {
    this.container.elem.set({
      x: 200,
      y: 200,
    });
    this.stage.addChild(this.container.elem);
    // initilising the board
    this.board = [];

    for (let i = 0; i < this.container.ROWS; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.container.COLS; j++) {
        this.board[i].push({ canPlace: [], color: null, coords: [i, j] });
      }
    }
    // allowed places per player
    this.board[0][0].canPlace.push("red");
    this.board[0][this.board[0].length - 1].canPlace.push("green");
    this.board[this.board.length - 1][
      this.board[this.board.length - 1].length - 1
    ].canPlace.push("yellow");
    this.board[this.board.length - 1][0].canPlace.push("blue");
    // draw the board
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.container.COLS; j++) {
        const container = new Container();
        container.coords = this.board[i][j].coords;

        container.set({
          y: i * this.container.ROWS,
          x: j * this.container.COLS,
        });

        this.drawRect(
          "#CCC",
          0,
          0,
          this.container.ROWS,
          this.container.COLS,
          container
        );
        this.container.elem.addChild(container);
      }
    }

    this.updateStage();
  }
  // draw Rectange
  drawRect(
    color,
    x,
    y,
    width,
    height,
    container = null,
    event,
    handler,
    addToStage = true
  ) {
    const graphics = new Graphics();
    graphics.setStrokeStyle(1);
    graphics.beginStroke("#000");
    graphics.beginFill(color);
    graphics.drawRect(x, y, width, height);
    const shape = new Shape(graphics);
    if (event && handler) {
      shape.on(event, handler);
    }
    let cont = false;
    if (container) {
      if (cont === false) {
        if (addToStage) {
          this.stage.addChild(container);
          cont = true;
        } else {
          cont = true;
        }
      }
      container.addChild(shape);
    } else {
      this.stage.addChild(shape);
    }
    this.updateStage();
  }
  // draw a line
  drawLine(color, startX, startY, toX, toY, stroke) {
    const line = new Shape();
    line.graphics.setStrokeStyle(stroke);
    line.graphics.beginStroke(color);
    line.graphics.moveTo(startX, startY);
    line.graphics.lineTo(toX, toY);
    line.graphics.endStroke();
    this.stage.addChild(line);
    this.updateStage();
  }
  // adding text
  addText(text, font, color, dir, x, y, name) {
    const newText = new Text(text, font, color);
    if (name) {
      newText.name = name;
    }
    newText.set({
      textAlign: dir || "center",
      textBaseline: "middle",
      x,
      y,
    });
    this.stage.addChild(newText);

    this.updateStage();
    return newText;
  }
  // update graphics stage
  updateStage() {
    this.stage.update();
  }
  // end the game
  end() {
    // stop the game timer
    clearInterval(this.gameTimer);
    this.activeShape = null;
    this.activePlayer = null;

    this.drawRect(
      "rgba(0, 0, 0, .1)",
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.addText(
      "GAME OVER",
      "bold 36px Arial",
      "#F47111",
      "center",
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }
}
