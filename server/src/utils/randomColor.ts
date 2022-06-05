import { Room } from "../rooms";

const colors = ["red", "green", "yellow", "blue"];
export default function randomColor(room: Room | null | undefined) {
  if (room) {
    const players = room.players;
    const usedColors = players.map((player) => player.color);
    // get a non used color by any player
    const color = colors.find((color) => !usedColors.includes(color));
    return color;
  }
}
