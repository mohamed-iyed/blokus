import GameShape from "./Shape";

export default class Player {
  id: string;
  type: "human" | "bot";
  color: string;
  shapes: GameShape[];
  isMe?: boolean;
  constructor(id: string, type: "human" | "bot", color: string) {
    this.id = id;
    this.type = type;
    this.color = color;
    this.shapes = [];
  }
}
