import { Socket, Server } from "socket.io";
import Rooms, { Player } from "./rooms";
const rooms = new Rooms();

interface Channel {
  name: string;
  handler: Function;
}
interface Channels {
  [key: string]: Channel;
}
const channels: Channels = {
  cg: {
    name: "CREATE_GAME",
    handler: createRoomHandler,
  },
  jg: {
    name: "JOIN_GAME",
    handler: joinRoomHandler,
  },
  dg: {
    name: "DELETE_GAME",
    handler: deleteGameHandler,
  },
  d: {
    name: "disconnect",
    handler: socketDisconnectHandler,
  },
  lg: {
    name: "LEAVE_GAME",
    handler: socketDisconnectHandler,
  },
};
interface This {
  socket: Socket;
  io: Server;
}
// create Room
function createRoomHandler(this: This, bots: Player[]) {
  rooms.create(this.socket.id);
  if (bots.length > 0) {
    for (const bot of bots) {
      rooms.addPlayer(this.socket.id, bot);
    }
    if (bots.length >= 4) {
      this.io.to(this.socket.id).emit("GAME_PLAYERS", bots);
      this.io
        .to(this.socket.id)
        .emit("NOTIFY", "success", "Game Starting ... (only bots)");
      this.io.to(this.socket.id).emit("START_GAME");
      return;
    }
  }
  if (bots.length < 4) {
    rooms.addPlayer(this.socket.id, new Player(this.socket.id, "human"));
  }

  if (rooms.get(this.socket.id)?.players.length === 4) {
    this.io.to(this.socket.id).emit("NOTIFY", "success", "Game Starting ...");
    this.io.to(this.socket.id).emit("START_GAME");
  }

  const players = rooms.get(this.socket.id)?.players;
  this.io.to(this.socket.id).emit("GAME_PLAYERS", players);
}
// join Room
function joinRoomHandler(this: This, roomId: string) {
  if (rooms.has(roomId)) {
    // add player to rooms array
    rooms.addPlayer(roomId, new Player(this.socket.id, "human"));
    // add player to socket room
    this.socket.join(roomId);

    this.io.to(this.socket.id).emit(channels.jg.name);

    // update the number of joined players in the client
    const players = rooms.get(roomId)?.players;

    this.io.to(roomId).emit("GAME_PLAYERS", players);

    if (players?.length === 4) {
      this.io.to(roomId).emit("NOTIFY", "success", "Game Starting ...");
      this.io.to(roomId).emit("START_GAME");
    }
  } else {
    this.io.to(this.socket.id).emit("NOTIFY", "error", "Room not found");
  }
}
// delete game when canceled or finished
function deleteGameHandler(this: This) {
  rooms.delete(this.socket.id);
  this.io.to(this.socket.id).emit("NOTIFY", "warn", "Game deleted");
  this.io.to(this.socket.id).emit("GAME_DELETED");
}
// if player has left the room
function socketDisconnectHandler(this: This) {
  const socketData = rooms.isPlayerActive(this.socket.id);

  // if the player in the creator of the game
  if (rooms.has(this.socket.id)) {
    rooms.delete(this.socket.id);
  } else if (socketData) {
    // if the player is not the creator of the game
    rooms.removePlayer(socketData.roomId, this.socket.id);
    this.socket.leave(socketData.roomId);
    this.io
      .to(socketData.roomId)
      .emit("GAME_PLAYERS", rooms.get(socketData.roomId)?.players);
  }
}
export default function init(this: Server, socket: Socket) {
  for (const key of Object.keys(channels)) {
    socket.on(
      channels[key].name,
      channels[key].handler.bind({ socket, io: this })
    );
  }
}
