class Player {
  id: string;
  constructor(id: string) {
    this.id = id;
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
  create(roomId: string) {
    if (this.has(roomId)) {
      return console.log("room already exist");
    }
    this.rooms.set(roomId, { players: [new Player(roomId)] });
  }
  addPlayer(roomId: string, player: any) {
    if (this.rooms.has(roomId)) {
      const room = this.rooms.get(roomId);
      if (room) {
        room.players.push(player);
      }
    }
  }
  has(roomId: string) {
    return this.rooms.has(roomId);
  }
  get(roomId: string) {
    if (this.has(roomId)) {
      return this.rooms.get(roomId);
    }
    return null;
  }
  delete(roomId: string) {
    this.rooms.delete(roomId);
  }
}
