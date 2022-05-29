import { Socket } from "socket.io";
import Rooms from "./rooms";
const rooms = new Rooms();

interface Channel {
  name: string;
  handler: Function;
}
interface Channels {
  [key: string]: Channel;
}

const channels: Channels = {
  cr: {
    name: "CREATE_GAME",
    handler: createRoomHandler,
  },
  jr: {
    name: "JOIN_GAME",
    handler: joinRoomHandler,
  },
  dg: {
    name: "DELETE_GAME",
    handler: deleteGameHandler,
  },
};

// create Room
function createRoomHandler(this: Socket) {
  rooms.create(this.id);
}
// join Room
function joinRoomHandler(this: Socket) {}
// delete game when canceled or finished
function deleteGameHandler(this: Socket) {
  rooms.delete(this.id);
}
export default function init(socket: Socket) {
  console.log(socket.id);
  for (const key of Object.keys(channels)) {
    socket.on(channels[key].name, channels[key].handler.bind(socket));
  }
}
