import { MutableRefObject, useEffect, useRef, useState } from "react";
import { GameType, useAppContext } from "../context";
// componenets
import NavBtn from "./NavButton";
import Spinner from "./Spinner";
// images
import Copy from "../assets/images/Copy.svg";
import Tick from "../assets/images/Tick.svg";
// game
import Game from "../game/Game";
import Player from "../game/Player";

function getBots(colorsRef: ColorsRefType) {
  const bots = [];
  for (const colorRef of colorsRef) {
    // check if color is checked
    if (!colorRef.current.checked) {
      const id = Math.floor(Math.random() * 1239048032).toString();
      bots.push(new Player(id, "bot", colorRef.current.value));
    }
  }
  if (bots.length > 0) {
    return bots;
  }
  return [];
}

interface ColorsRefType {
  [key: string]: MutableRefObject<HTMLInputElement>;
  [Symbol.iterator]: () => Generator<
    MutableRefObject<HTMLInputElement>,
    void,
    undefined
  >;
}
function Step1() {
  const { setStep, setGame, socket } = useAppContext();
  const [bots, setBots] = useState<Player[] | void>([]);

  const colorsRef: ColorsRefType = {
    red: useRef() as MutableRefObject<HTMLInputElement>,
    blue: useRef() as MutableRefObject<HTMLInputElement>,
    green: useRef() as MutableRefObject<HTMLInputElement>,
    yellow: useRef() as MutableRefObject<HTMLInputElement>,
    // make this object iterable
    [Symbol.iterator]: function* () {
      for (const key of Object.keys(this)) {
        yield this[key];
      }
    },
  };

  useEffect(() => {
    setBots(getBots(colorsRef));
  }, []);

  return (
    <div className="flex flex-col gap-3 items-center">
      <h1 className="text-center text-xl">Create Game</h1>
      <p className="font-light text-center text-gray-500">
        choose the colors of the players that you want to play with :
      </p>
      <div className="flex flex-wrap gap-2">
        <label
          htmlFor="red"
          className="bg-red-400 rounded-lg cursor-pointer min-h-[40px] py-2 flex flex-col items-center gap-1 justify-center basis-20 flex-1"
        >
          <p className="text-white">Red</p>
          <input
            type="checkbox"
            value="red"
            id="red"
            className="cursor-pointer"
            ref={colorsRef.red}
            onChange={() => setBots(getBots(colorsRef))}
          />
        </label>
        <label
          htmlFor="green"
          className="bg-green-400 rounded-lg cursor-pointer min-h-[40px] py-2 flex flex-col items-center gap-1 justify-center basis-20 flex-1"
        >
          <p className="text-white">Green</p>
          <input
            type="checkbox"
            value="green"
            id="green"
            className="cursor-pointer"
            ref={colorsRef.green}
            onChange={() => setBots(getBots(colorsRef))}
          />
        </label>
        <label
          htmlFor="blue"
          className="bg-blue-400 rounded-lg cursor-pointer min-h-[40px] py-2 flex flex-col items-center gap-1 justify-center basis-20 flex-1"
        >
          <p className="text-white">Blue</p>
          <input
            type="checkbox"
            value="blue"
            id="blue"
            className="cursor-pointer"
            ref={colorsRef.blue}
            onChange={() => setBots(getBots(colorsRef))}
          />
        </label>
        <label
          htmlFor="yellow"
          className="bg-yellow-400 rounded-lg cursor-pointer min-h-[40px] py-2 flex flex-col items-center gap-1 justify-center basis-20 flex-1"
        >
          <p className="text-white">Yellow</p>
          <input
            type="checkbox"
            value="yellow"
            id="yellow"
            className="cursor-pointer"
            ref={colorsRef.yellow}
            onChange={() => setBots(getBots(colorsRef))}
          />
        </label>
      </div>
      <p className="text-gray-400 text-sm font-light text-center">
        * if a color is not chosen, a bot will take its place
      </p>
      <div className="flex gap-4">
        <NavBtn
          text="Next"
          event="CREATE_GAME"
          args={[bots]}
          cb={() => {
            // go to next step
            setStep({ type: "createGame", number: 2 });
            // make the id of the creator the id of the game
            setGame((prev: GameType) => ({ ...prev, code: socket.id }));
          }}
        />
        <NavBtn text="Back" cb={() => setStep({ type: null, number: 0 })} />
      </div>
    </div>
  );
}
function Step2() {
  const {
    socket,
    setStep,
    game: { code, players },
  } = useAppContext();
  const [ticked, setTicked] = useState(false);

  useEffect(() => {
    if (ticked) {
      const timeOut = setTimeout(() => setTicked(false), 2000);

      return () => clearTimeout(timeOut);
    }
  }, [ticked]);
  return (
    <div className="flex flex-col items-center justify-between gap-4">
      <h2 className="font-bold text-center flex gap-2 items-center">
        Game Code :{" "}
        <span className="text-red-400 font-light tracking-widest">{code}</span>
        <span
          className="bg-gray-200 p-1 rounded-md shadow-md cursor-pointer relative"
          onClick={() => {
            navigator.clipboard.writeText(socket.id);
            setTicked(true);
          }}
        >
          {ticked && (
            <span className="absolute top-[-35px] left-[50%] translate-x-[-50%] bg-gray-200 px-2 rounded-md">
              Copied
              <span className="rotate-180 left-[50%] translate-x-[-50%] absolute block clip-triangle w-2 h-2 bg-gray-200"></span>
            </span>
          )}
          <img
            src={ticked ? Tick : Copy}
            alt="copy game code"
            width="25"
            height="25"
          />
        </span>
      </h2>
      <div className="text-center">
        {players.length !== 4 && (
          <p className="flex justify-center items-center gap-2 flex-wrap">
            Waiting for players to join ...
            <Spinner />{" "}
          </p>
        )}
        <p>
          ready players :{" "}
          <span className="text-gray-400 font-bold">{players.length} / 4</span>
        </p>
      </div>
      <div className="flex gap-2">
        <NavBtn text="Cancel" event="DELETE_GAME" />
      </div>
    </div>
  );
}
function Step3() {
  const canvasRef = useRef() as MutableRefObject<HTMLCanvasElement>;
  const { game } = useAppContext();

  useEffect(() => {
    const newGame = new Game({
      canvas: canvasRef.current,
      cellWidth: 20,
      gameBoardWidth: 0,
      players: game.players,
    });
    newGame.start();
  }, []);
  return (
    <canvas id="canvas" ref={canvasRef} width="1200" height="800">
      <h1>Your Browser does not support CANVAS API</h1>
    </canvas>
  );
}
interface Props {
  step: number;
}

export default function CreateGame({ step }: Props) {
  switch (step) {
    case 1:
      return <Step1 />;
    case 2:
      return <Step2 />;
    case 3:
      return <Step3 />;
    default:
      return <Step1 />;
  }
}
