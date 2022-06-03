export default class Player {
  id: string;
  type: "human" | "bot";
  color: string;

  constructor(id: string, type: "human" | "bot", color: string) {
    this.id = id;
    this.type = type;
    this.color = color;
  }
}
