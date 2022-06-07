import { useCallback } from "react";
import { useAppContext } from "../context";

interface Props {
  text: string;
  event?: string;
  args?: any[];
  cb?: Function;
}

export default function NavBtn({ text, event, args = [], cb }: Props) {
  const { socket, channels } = useAppContext();
  const handleClick = useCallback(() => {
    if (event) {
      if (channels.includes(event)) {
        socket.emit(event, ...args);
      } else {
        throw new Error("event is not defined");
      }
    }
    if (cb) {
      cb();
    }
  }, [event, args, cb, socket, channels]);

  return (
    <button onClick={handleClick} className="btn">
      {text}
    </button>
  );
}
