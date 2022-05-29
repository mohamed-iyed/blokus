import { Step, useAppContext } from "../context";

interface Props {
  type: "back" | "next";
  text: string;
  event?: string;
}
export default function NavBtn({ type, text, event }: Props) {
  const { setStep, socket, channels } = useAppContext();

  function backHandler() {
    setStep((prev: Step) => {
      if (prev.number === 1) {
        return { number: 0, type: null };
      }
      return { ...prev, number: prev.number - 1 };
    });
    if (event) {
      if (channels.includes(event)) {
        socket.emit(event);
      } else {
        throw new Error(`event : ${event} does not exist`);
      }
    }
  }

  function nextHandler() {
    setStep((prev: Step) => ({ ...prev, number: prev.number + 1 }));
    if (event) {
      if (channels.includes(event)) {
        socket.emit(event);
      } else {
        throw new Error(`event : ${event} does not exist`);
      }
    }
  }

  if (type === "back") {
    return (
      <button onClick={backHandler} className="btn">
        {text}
      </button>
    );
  } else {
    return (
      <button onClick={nextHandler} className="btn">
        {text}
      </button>
    );
  }
}
