module.exports = class Rooms {
  constructor() {
    this.rooms = new Map();
  }
  create(roomId) {
    if (this.has(roomId)) {
      return console.log("room already exist");
    }
    this.rooms.set(roomId, { players: [] });
  }
  addPlayer(roomId, player) {
    const room = this.rooms.get(roomId);
    room.players.push(player);
  }
  has(roomId) {
    return this.rooms.has(roomId);
  }
  get(roomId) {
    if (this.has(roomId)) {
      return this.rooms.get(roomId);
    }
    return null;
  }
  delete(roomId) {
    this.rooms.delete(roomId);
  }
};
