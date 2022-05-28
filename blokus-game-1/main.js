import "./style.css";
import Game from "./src/Game";
import Player from "./src/Player";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000");

const content = document.querySelectorAll("#content > li");
let navNum = 0;
document.addEventListener("click", function (e) {
  // page content per phase
  if (
    (e.target.classList.contains("nav-btn") &&
      e.target.classList.contains("back-btn")) ||
    (e.target.parentElement.classList.contains("nav-btn") &&
      e.target.parentElement.classList.contains("back-btn"))
  ) {
    content.forEach((section) => section.classList.add("hidden"));
    content[--navNum].classList.remove("hidden");
  } else if (e.target.classList.contains("nav-btn")) {
    content.forEach((section) => section.classList.add("hidden"));
    content[++navNum].classList.remove("hidden");
  }

  if (e.target.id === "launchGame") {
    // get the game form data
    const gameForm = document.getElementById("gameForm");
    gameForm.addEventListener("submit", (e) => e.preventDefault());
    const colors = Array.from(document.querySelectorAll('[type="checkbox"'));
    const players = colors.reduce(
      (acc, color) =>
        color.checked
          ? [...acc, { color: color.value, type: "human" }]
          : [...acc, { color: color.value, type: "bot" }],
      []
    );

    // start the game
    // startGame(players);
  }
});

function startGame(players) {
  const canvas = document.getElementById("canvas");
  const game = new Game({
    canvas,
    cellWidth: 20,
    players: [
      new Player("human"),
      new Player("human"),
      new Player("human"),
      new Player("human"),
    ],
  });
  game.start(players);
}
