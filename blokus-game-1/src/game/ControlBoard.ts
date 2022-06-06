import { Container, Text } from "createjs-module";
import { toast } from "react-toastify";
import Board from "./Board";
import Game from "./Game";
import GameStage from "./GameStage";
import Player from "./Player";
import GameShape from "./Shape";

function changeShapeStatus(this: ControlBoard, status: string) {
  switch (status) {
    case "flip":
      this.activeShape = this.activeShape?.flip();
      break;
    case "rotateLeft":
      this.activeShape = this.activeShape?.rotateLeft();
      break;
    case "rotateRight":
      this.activeShape = this.activeShape?.rotateRight();
      break;
  }
}

interface ActiveShape {
  container: Container;
  canvasShapeContainer: Container;
  current: GameShape;
}
interface TimeLeft {
  container: Container;
  current: number;
  canvasText: Text;
  timer: number;
}
interface ActivePlayer {
  container: Container;
  canvasText: Text;
}
interface Score {
  color: string;
  canvasElem: { container: Container; text: Text };
  current: number;
}
type Scores = Score[];

export default class ControlBoard extends Board {
  // show the activeShape
  _activeShape: ActiveShape | any = {
    container: this.makeContainer(25, 20),
    canvasShapeContainer: new Container(),
    current: undefined,
  };
  // acitve player
  private _activePlayer: ActivePlayer | any = {
    container: this.makeContainer(100, 340),
    canvasText: undefined,
  };
  _timeLeft: TimeLeft | any = {
    container: this.makeContainer(130, 450),
    current: 30,
    canvasText: undefined,
    timer: null,
  };
  private scores: Scores | any = [
    {
      color: null,
      canvasElem: {
        container: null,
        text: null,
      },
      current: null,
    },
    {
      color: null,
      canvasElem: {
        container: null,
        text: null,
      },
      current: null,
    },
    {
      color: null,
      canvasElem: {
        container: null,
        text: null,
      },
      current: null,
    },
    {
      color: null,
      canvasElem: {
        container: null,
        text: null,
      },
      current: null,
    },
  ];

  private skipTurnBtn: Container | null = null;
  private endGameBtn: Container | null = null;
  private doneBtn: Container | null = null;
  private restartGameBtn: Container | null = null;

  constructor(
    width: number,
    height: number,
    x: number,
    y: number,
    stage: GameStage,
    game: Game
  ) {
    super(width, height, x, y, stage, game);

    this.game.socket.on("ACTIVE_PLAYER", (activePlayerId: any) => {
      if (activePlayerId) {
        // handled by the activePlayer setter
        this.activePlayer = activePlayerId;
      }
    });

    this.game.socket.on("TIME_LEFT", (timeLeft: any) => {
      if (this._activePlayer.current !== this.game.me) {
        if (timeLeft) {
          this.timeLeft = timeLeft;
        } else {
          this.calcScore();
          this.timeLeft = 30;
          this.activeShape = null;
        }
      }
    });
    this.game.socket.on("ACTIVE_SHAPE", (activeShapeNumber: any) => {
      if (this._activePlayer.current !== this.game.me && this.activePlayer) {
        const shape = this._activePlayer.current.shapes.find(
          (shape: GameShape) => shape.number === activeShapeNumber
        );

        this.activeShape = shape;
      }
    });
    this.game.socket.on("CHANGE_ACTIVE_SHAPE", (status: string) => {
      if (this._activePlayer.current !== this.game.me) {
        changeShapeStatus.call(this, status);
      }
    });
  }
  draw(players: Player[]) {
    this._activeShape.canvasShapeContainer.set({
      x: 140,
      y: 150,
    });
    // active shape background
    this.stage.drawRect("#F5F5F5", 0, 0, 350, 300, this._activeShape.container);

    this.stage.addText(
      "ACTIVE SHAPE",
      "bold 30px Arial",
      "#555555",
      "center",
      160,
      30,
      this._activeShape.container
    );

    this.stage.drawRect(
      "#FEFEFE",
      25,
      70,
      300,
      200,
      this._activeShape.container
    );
    this._activeShape.container.addChild(
      this._activeShape.canvasShapeContainer
    );

    this.stage.update();
    // flip the active shape
    this.stage.addImage(
      30,
      30,
      "rotate360.svg",
      160,
      75,
      this._activeShape.container,
      () => {
        if (this.activePlayer === this.game.me) {
          changeShapeStatus.call(this, "flip");
          this.game.socket.emit(
            "CHANGE_ACTIVE_SHAPE",
            "flip",
            this.game.gameCode
          );
        } else {
          toast.warn("Not Your Turn");
        }
      }
    );
    // rotate shape 90 deg left
    this.stage.addImage(
      30,
      30,
      "rotate90left.svg",
      190,
      75,
      this._activeShape.container,
      () => {
        if (this.activePlayer === this.game.me) {
          changeShapeStatus.call(this, "rotateLeft");
          this.game.socket.emit(
            "CHANGE_ACTIVE_SHAPE",
            "rotateLeft",
            this.game.gameCode
          );
        } else {
          toast.warn("Not Your Turn");
        }
      }
    );
    // rotate shape 90 deg right
    this.stage.addImage(
      30,
      30,
      "rotate90right.svg",
      130,
      75,
      this._activeShape.container,
      () => {
        if (this.activePlayer === this.game.me) {
          changeShapeStatus.call(this, "rotateRight");
          this.game.socket.emit(
            "CHANGE_ACTIVE_SHAPE",
            "rotateRight",
            this.game.gameCode
          );
        } else {
          toast.warn("Not Your Turn");
        }
      }
    );

    // active player
    this.stage.drawRect(
      "#FAFAFA",
      0,
      0,
      200,
      100,
      this._activePlayer.container
    );
    this.stage.addText(
      "Current player : ",
      "bold 24px Arial",
      "black",
      "center",
      100,
      25,
      this._activePlayer.container
    );
    this._activePlayer.canvasText = this.stage.addText(
      "",
      "bold 24px Arial",
      "red",
      "center",
      95,
      70,
      this._activePlayer.container
    );

    this.stage.drawRect("#FAFAFA", 0, 0, 150, 40, this._timeLeft.container);
    this.stage.addText(
      `Time left : `,
      "bold 20px Arial",
      "black",
      "center",
      60,
      20,
      this._timeLeft.container
    );
    this._timeLeft.canvasText = this.stage.addText(
      `${this._timeLeft.current}`,
      "20px Arial",
      "black",
      "center",
      120,
      20,
      this._timeLeft.container
    );

    players.forEach((player, i) => {
      this.scores[i].color = player.color;
      this.scores[i].current = 0;
      this.scores[i].canvasElem.container = this.makeContainer(
        150,
        i * 35 + 500
      );
      this.stage.drawRect(
        player.color !== "yellow" ? player.color : "#F7C600",
        0,
        0,
        100,
        30,
        this.scores[i]?.canvasElem?.container
      );
      this.stage.addText(
        "score : ",
        "bold 16px Arial",
        "white",
        "center",
        40,
        15,
        this.scores[i].canvasElem.container
      );
      this.scores[i].canvasElem.text = this.stage.addText(
        `${this.scores[i].current}`,
        "bold 16px Arial",
        "white",
        "center",
        80,
        15,
        this.scores[i].canvasElem.container
      );
    });

    // skip turn btn
    this.skipTurnBtn = this.makeContainer(25, 650);
    this.skipTurnBtn.cursor = "pointer";
    this.stage.drawRect("#CCC", 0, 0, 120, 50, this.skipTurnBtn);
    this.stage.addText(
      "Skip turn",
      "bold 20px Arial",
      "#FAFAFA",
      "center",
      60,
      25,
      this.skipTurnBtn
    );

    // done btn
    this.doneBtn = this.makeContainer(275, 650);
    this.doneBtn.cursor = "pointer";
    this.stage.drawRect("#CCC", 0, 0, 90, 50, this.doneBtn);
    this.stage.addText(
      "Done",
      "bold 20px Arial",
      "#FAFAFA",
      "center",
      45,
      25,
      this.doneBtn
    );
  }
  drawControlBtns() {
    // end game btn
    this.endGameBtn = this.makeContainer(150, 650);
    this.endGameBtn.cursor = "pointer";
    this.stage.drawRect("#CCC", 0, 0, 120, 50, this.endGameBtn);
    this.stage.addText(
      "End game",
      "bold 20px Arial",
      "#FAFAFA",
      "center",
      60,
      25,
      this.endGameBtn
    );
    // restart game btn
    this.restartGameBtn = this.makeContainer(130, 710);
    this.restartGameBtn.cursor = "pointer";
    this.stage.drawRect("#CCC", 0, 0, 150, 50, this.restartGameBtn);
    this.stage.addText(
      "Restart Game",
      "bold 20px Arial",
      "#FAFAFA",
      "center",
      75,
      25,
      this.restartGameBtn
    );
  }
  startTimer() {
    this._timeLeft.timer = setInterval(() => {
      this.timeLeft = --this._timeLeft.current;
      this.game.socket.emit(
        "TIME_LEFT",
        this._timeLeft.current,
        this.game.gameCode
      );
      if (this._timeLeft.current === 0) {
        this.game.endTurn();
      }
    }, 1000);
  }
  endTimer() {
    clearInterval(this._timeLeft.timer);
    this.timeLeft = 30;
  }
  get activeShape() {
    return this._activeShape.current;
  }
  set activeShape(newActiveShape) {
    if (newActiveShape) {
      this._activeShape.current = newActiveShape;
      this._activeShape.canvasShapeContainer.removeAllChildren();
      const canvasShapeClone =
        this._activeShape.current.canvasShape.clone(true);
      canvasShapeClone.set({
        x: 0,
        y: 0,
      });
      this._activeShape.canvasShape = canvasShapeClone;

      this._activeShape.canvasShapeContainer.addChild(
        this._activeShape.canvasShape
      );
      if (this.activePlayer && this.activePlayer.type === "human") {
        this.game.gameBoard.showCanPlaceZones();
      }
    } else {
      this._activeShape.current = null;
      this._activeShape.canvasShapeContainer.removeAllChildren();
    }
    this.stage.update();
  }
  get activePlayer() {
    return this._activePlayer.current;
  }
  set activePlayer(newActivePlayer) {
    if (newActivePlayer) {
      // finding the player
      if (typeof newActivePlayer === "string") {
        this._activePlayer.current = this.game.players.find(
          (player) => player.id === newActivePlayer
        );
      } else {
        this._activePlayer.current = newActivePlayer;
      }

      // if active player is me then enable the game board
      if (this._activePlayer.current.type === "human") {
        if (this._activePlayer.current === this.game.me) {
          this._activePlayer.canvasText.text = "You !";
          this._activePlayer.canvasText.color =
            this._activePlayer.current.color;
          this.game.gameBoard.enable(this.game.me);
          this.startTimer();
        } else {
          this._activePlayer.canvasText.text = this._activePlayer.current.color;
          this._activePlayer.canvasText.color =
            this._activePlayer.current.color;
          this.game.gameBoard.disable();
        }
      } else {
        this._activePlayer.canvasText.text = "Bot !";
        this._activePlayer.canvasText.color = this._activePlayer.current.color;
        if (this.game.socket.id === this.game.gameCode) {
          this.game.gameBoard.botTurn();
        }
      }
    } else {
      this._activePlayer.canvasText.text = null;
    }
    this.stage.update();
  }
  get timeLeft() {
    return this._timeLeft.current;
  }
  set timeLeft(newTimeLeft) {
    this._timeLeft.current = newTimeLeft;
    this._timeLeft.canvasText.text = newTimeLeft;
    this.stage.update();
  }
  calcScore() {
    const num = this.activeShape.matrix.reduce((acc: number, row: number[]) => {
      return acc + row.filter((elem: number) => elem === 1).length;
    }, 0);
    const score = this.scores.find(
      (elem: Score) => elem.color === this.activePlayer.color
    );
    score.canvasElem.text.text = `${num + +score.canvasElem.text.text}`;
    this.stage.update();
  }
}
