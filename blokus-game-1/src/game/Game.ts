import ControlBoard from "./ControlBoard";
import GameBoard from "./GameBoard";
import GameStage from "./GameStage";
import Player from "./Player";

interface GameInfo {
  canvas: HTMLCanvasElement;
  gameBoardWidth: number;
  cellWidth: number;
  players: Player[];
}

export default class Game {
  gameStage: GameStage;
  players: Player[];
  gameBoard: GameBoard;
  controlBoard: ControlBoard;

  #FALLBACK_GAME_DIMENSTIONS = (canvasWidth: number) => {
    const oneThird = canvasWidth / 3;
    return {
      gameBoardWidth: oneThird * 2,
      controlBoardWidth: oneThird,
    };
  };
  constructor({
    canvas,
    gameBoardWidth = 0,
    cellWidth = 20,
    players,
  }: GameInfo) {
    this.gameStage = new GameStage(canvas, cellWidth);
    this.players = players;

    // calculate dimensions
    let controlBoardWidth;
    if (!gameBoardWidth) {
      let {
        gameBoardWidth: gameBoardWidthFallBack,
        controlBoardWidth: controlBoardWidthFallBack,
      } = this.#FALLBACK_GAME_DIMENSTIONS(canvas.offsetWidth);

      gameBoardWidth = gameBoardWidthFallBack;
      controlBoardWidth = controlBoardWidthFallBack;
    } else {
      controlBoardWidth = canvas.offsetWidth - gameBoardWidth;
    }

    this.gameBoard = new GameBoard(
      gameBoardWidth,
      canvas.offsetHeight,
      0,
      0,
      this.gameStage
    );
    this.controlBoard = new ControlBoard(
      controlBoardWidth,
      canvas.offsetHeight,
      gameBoardWidth,
      0,
      this.gameStage
    );
  }
  start() {
    this.gameBoard.draw(this.players);
    this.controlBoard.draw(this.players);
  }
}
