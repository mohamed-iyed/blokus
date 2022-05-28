const Rooms = require("./Rooms");
const rooms = new Rooms();

const channels = {
  cr: {
    name: "CREATE_ROOM",
    handler: createRoomHandler,
  },
  jr: {
    name: "JOIN_ROOM",
    handler: joinRoomHandler,
  },
};

// create Room
function createRoomHandler() {
  rooms.create(this.id);
}
// join Room
function joinRoomHandler() {}

module.exports = function init(socket) {
  for (const key of Object.keys(channels)) {
    socket.on(channels[key].name, channels[key].handler.bind(socket));
  }
};
