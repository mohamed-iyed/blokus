import { Socket, Server } from "socket.io";
import Rooms, { Player } from "./rooms";
import randomColor from "./utils/randomColor";
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
  et: {
    name: "END_TURN",
    handler: endTurnHandler,
  },
  tl: {
    name: "TIME_LEFT",
    handler: timeLeftHandler,
  },
  as: {
    name: "ACTIVE_SHAPE",
    handler: activeShapeHandler,
  },
  sas: {
    name: "CHANGE_ACTIVE_SHAPE",
    handler: changeActiveShapeHandler,
  },
  doh: {
    name: "DRAW_ON_HOVER",
    handler: drawOnHoverHandler,
  },
  udoo: {
    name: "UNDRAW_ON_OUT",
    handler: undrawOnOutHandler,
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
    rooms.addPlayer(
      this.socket.id,
      new Player(
        this.socket.id,
        "human",
        randomColor(rooms.get(this.socket.id))
      )
    );
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
  const room = rooms.get(roomId);

  if (room) {
    // add player to rooms array
    rooms.addPlayer(
      roomId,
      new Player(this.socket.id, "human", randomColor(rooms.get(roomId)))
    );
    // add player to socket room
    this.socket.join(roomId);

    this.io.to(this.socket.id).emit(channels.jg.name);

    // update the number of joined players in the client
    const players = room.players;

    this.io.to(roomId).emit("GAME_PLAYERS", players);

    if (players?.length === 4) {
      this.io.to(roomId).emit("NOTIFY", "success", "Game Starting ...");
      this.io.to(roomId).emit("START_GAME", players[0].id);
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
// end turn if timeout or player has left the room or player placed his shape
function endTurnHandler(this: This, gameId: string) {
  const room = rooms.get(gameId);
  if (room) {
    const playerIndex = room.players.findIndex(
      (player) => player.id === this.socket.id
    );
    if (playerIndex !== -1) {
      let nextPlayerIndex;
      if (playerIndex === room.players.length - 1) {
        nextPlayerIndex = 0;
      } else {
        nextPlayerIndex = playerIndex + 1;
      }
      this.io
        .to(gameId)
        .emit("ACTIVE_PLAYER", room.players[nextPlayerIndex].id);
    }
  }
}
// send the new time left to all players in the room
function timeLeftHandler(this: This, newTimeLeft: number, gameId: string) {
  const room = rooms.get(gameId);
  if (room) {
    this.io.to(gameId).emit("TIME_LEFT", newTimeLeft);
  }
}
// send the new active shape to all players
function activeShapeHandler(this: This, shapeNumber: any, gameId: string) {
  const room = rooms.get(gameId);
  if (room) {
    this.io.to(gameId).emit("ACTIVE_SHAPE", shapeNumber);
  }
}
// change acitve shape status (flip / rotate left / right)
function changeActiveShapeHandler(this: This, status: string, gameId: string) {
  const room = rooms.get(gameId);
  if (room) {
    this.io.to(gameId).emit("CHANGE_ACTIVE_SHAPE", status);
  }
}
// when player hover on board with an active shape
function drawOnHoverHandler(this: This, coords: number[], gameId: string) {
  const room = rooms.get(gameId);
  if (room) {
    this.io.to(gameId).emit("DRAW_ON_HOVER", coords);
  }
}
// when player leaves the board with an active shape
function undrawOnOutHandler(this: This, coords: number[], gameId: string) {
  const room = rooms.get(gameId);
  if (room) {
    this.io.to(gameId).emit("UNDRAW_ON_OUT", coords);
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
