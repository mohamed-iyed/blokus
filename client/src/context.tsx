import { createContext, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";
import Player from "./game/Player";

const socket: Socket = io("http://localhost:4000/", {
  withCredentials: true,
});

const channels: string[] = [
  "CREATE_GAME",
  "JOIN_GAME",
  "DELETE_GAME",
  "LEAVE_GAME",
];

export interface GameType {
  code: string;
  players: any[];
  activePlayer: string | null;
}
interface ContextType {
  socket: Socket;
  readonly channels: string[];
  step: Step;
  setStep: Function;
  error: boolean;
  setError: Function;
  game: GameType;
  setGame: Function;
}
const Context = createContext<ContextType>({
  socket,
  channels,
  step: { number: 0, type: null },
  setStep: () => {},
  error: false,
  setError: () => {},
  game: { code: "", players: [], activePlayer: null },
  setGame: () => {},
});

// Context Provider
interface ProviderProps {
  children: React.ReactElement;
}

export interface Step {
  number: number;
  type: "createGame" | "joinGame" | null;
}

export function ContextProvider({ children }: ProviderProps) {
  const [step, setStep] = useState<Step>({ number: 0, type: null });
  const [error, setError] = useState(false);
  const [game, setGame] = useState({
    code: "",
    players: [],
    activePlayer: null,
  });

  return (
    <Context.Provider
      value={{
        socket,
        channels,
        step,
        setStep,
        error,
        setError,
        game,
        setGame,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAppContext() {
  return useContext(Context);
}
