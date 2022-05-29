import { createContext, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:4000/", {
  withCredentials: true,
});

const channels: string[] = ["CREATE_GAME", "JOIN_GAME", "DELETE_GAME"];

interface ContextType {
  socket: Socket;
  readonly channels: string[];
  step: Step;
  setStep: Function;
}
const Context = createContext<ContextType>({
  socket,
  channels,
  step: { number: 0, type: null },
  setStep: () => {},
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

  return (
    <Context.Provider value={{ socket, channels, step, setStep }}>
      {children}
    </Context.Provider>
  );
}

export function useAppContext() {
  return useContext(Context);
}
