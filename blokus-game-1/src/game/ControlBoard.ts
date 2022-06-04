import { Container, Text } from "createjs-module";
import Board from "./Board";
import GameStage from "./GameStage";
import Player from "./Player";
import GameShape from "./Shape";

interface ActiveShape {
  container: Container;
  canvasShapeContainer: Container;
  current: GameShape;
}

interface TimeLeft {
  container: Container;
  current: number;
  canvasText: Text;
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
  private _activeShape: ActiveShape | any = {
    container: this.makeContainer(25, 20),
    canvasShapeContainer: new Container(),
    current: undefined,
  };
  // acitve player
  private _activePlayer: ActivePlayer | any = {
    container: this.makeContainer(100, 340),
    canvasText: undefined,
  };
  private _timeLeft: TimeLeft | any = {
    container: this.makeContainer(130, 450),
    current: 30,
    canvasText: undefined,
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
    stage: GameStage
  ) {
    super(width, height, x, y, stage);
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
        this.activeShape.current = this.activeShape.current?.flip();
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
        this.activeShape.current = this.activeShape.current?.rotateLeft();
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
        this.activeShape.current = this.activeShape.current?.rotateRight();
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
      "red !",
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
  get activeShape() {
    return this._activeShape;
  }
  set activeShape(newActiveShape) {
    this._activeShape.current = newActiveShape;
    this._activeShape.canvasShapeContainer.removeAllChildren();
    this._activeShape.canvasShapeContainer.addChild(newActiveShape.canvasShape);
    this.stage.update();
  }
  get activePlayer() {
    return this._activePlayer;
  }
  set activePlayer(newActivePlayer) {
    this._activePlayer.canvasText.text = newActivePlayer;
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
  changeColorScore(color: string, newScore: number) {
    const score = this.scores.find((elem: Score) => elem.color === color);
    score.canvasElem.text.text = newScore;
    this.stage.update();
  }
}
