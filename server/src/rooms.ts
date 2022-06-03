export class Player {
  id: string;
  type: "human" | "bot";
  color?: string;
  constructor(id: string, type: "human" | "bot", color?: string) {
    this.id = id;
    this.type = type;
    this.color = color;
  }
}

interface Room {
  players: any[];
}
export default class Rooms {
  rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
  }
  create(gameId: string) {
    if (this.has(gameId)) {
      return console.log("room already exist");
    }
    this.rooms.set(gameId, { players: [] });
  }
  addPlayer(gameId: string, player: Player) {
    if (this.rooms.has(gameId)) {
      const room = this.rooms.get(gameId);

      room?.players.push(player);
    } else {
      throw new Error("room not found");
    }
  }
  removePlayer(gameId: string, playerId: string) {
    if (this.has(gameId)) {
      const room = this.get(gameId);
      if (room) {
        const players = room.players;
        for (const player of players) {
          if (player.id === playerId) {
            const index = players.indexOf(player);
            players.splice(index, 1);
            return;
          }
        }
      }
    }
  }
  has(gameId: string) {
    return this.rooms.has(gameId);
  }
  get(gameId: string) {
    if (this.has(gameId)) {
      return this.rooms.get(gameId);
    }
    return null;
  }
  delete(gameId: string) {
    this.rooms.delete(gameId);
  }
  isPlayerActive(playerId: string) {
    const keys = this.rooms.keys();
    for (const key of keys) {
      const room = this.rooms.get(key);
      if (room) {
        const players = room.players;
        for (const player of players) {
          if (player.id === playerId) {
            return { playerId: player.id, roomId: key };
          }
        }
      }
    }
    return false;
  }
}
