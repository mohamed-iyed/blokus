import { GameType, useAppContext } from "../context";
import NavBtn from "./NavButton";
import Spinner from "./Spinner";
import Copy from "../assets/images/Copy.svg";
import Tick from "../assets/images/Tick.svg";
import { useEffect, useState } from "react";

interface Props {
  step: number;
}

function Step1() {
  const {
    game: { code },
    setGame,
    setStep,
  } = useAppContext();

  return (
    <div className="flex flex-col justify-between items-center">
      <h2>Join a Game</h2>
      <input
        type="text"
        placeholder="game code .."
        className="self-center shadow-sm rounded-lg p-1 border focus:outline-red-400 transition-all"
        value={code}
        onChange={(e) =>
          setGame((prev: GameType) => ({ ...prev, code: e.target.value }))
        }
      />
      <div className="flex gap-4">
        <NavBtn text="Back" cb={() => setStep({ type: null, number: 0 })} />
        <NavBtn text="Confirm" event="JOIN_GAME" args={[code]} />
      </div>
    </div>
  );
}
function Step2() {
  const {
    game: { code, players },
    setStep,
    socket,
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
        <NavBtn
          text="Cancel"
          event="LEAVE_GAME"
          cb={() => setStep({ type: "joinGame", number: 1 })}
        />
      </div>
    </div>
  );
}
function Step3() {
  useEffect(() => {}, []);
  return (
    <canvas id="canvas">
      <h1>Your Browser does not support CANVAS API</h1>
    </canvas>
  );
}
export default function JoinGame({ step }: Props) {
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
