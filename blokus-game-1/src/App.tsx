import { useCallback, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import CreateGame from "./components/CreateGame";
import JoinGame from "./components/JoinGame";
import Welcome from "./components/Welcome";
import { GameType, useAppContext } from "./context";
import "react-toastify/dist/ReactToastify.min.css";

type allowedTypes = "success" | "error" | "info" | "warning";

export default function App() {
  const { step, socket, setStep, setGame, game } = useAppContext();

  // handle notification send by the server
  const handleNotify = useCallback((type: allowedTypes, message: string) => {
    toast[type](message);
  }, []);

  // handle player join
  const handleJoinGame = useCallback(() => {
    setStep({ type: "joinGame", number: 2 });
  }, []);

  // handle new players join to the game
  const handleGamePlayersChange = useCallback((players: any[]) => {
    setGame((prev: GameType) => ({ ...prev, players }));
  }, []);

  // handle if game deleted and the player is a member of the game
  const handleGameDelete = useCallback(() => {
    setStep({ type: null, number: 0 });
  }, [game.code, socket.id]);

  useEffect(() => {
    socket.on("NOTIFY", handleNotify);
    socket.on("JOIN_GAME", handleJoinGame);
    socket.on("GAME_PLAYERS", handleGamePlayersChange);
    socket.on("GAME_DELETED", handleGameDelete);
  }, []);

  let content;

  switch (true) {
    case step.number === 0 && step.type === null:
      content = <Welcome />;
      break;
    case step.number !== 0 && step.type === "createGame":
      content = <CreateGame step={step.number} />;
      break;
    case step.number !== 0 && step.type === "joinGame":
      content = <JoinGame step={step.number} />;
      break;
    default:
      content = <Welcome />;
  }
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center">
      <ToastContainer />
      <div className="container flex justify-center py-6 px-4 w-[300px] sm:w-auto sm:max-w-[400px] min-h-[200px] bg-white rounded-md border shadow-md">
        {content}
      </div>
    </main>
  );
}
