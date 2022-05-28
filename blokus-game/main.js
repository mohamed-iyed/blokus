import "./style.css";
import Game from "./src/Game";

document.addEventListener("click", function (e) {
  // page content per phase
  const content = document.querySelectorAll("#content > li");
  if (e.target.id === "startGameBtn") {
    content.forEach((section) => section.classList.add("hidden"));
    content[1].classList.remove("hidden");
  }
  if (e.target.id === "backBtn" || e.target.parentElement?.id === "backBtn") {
    content.forEach((section) => section.classList.add("hidden"));
    content[0].classList.remove("hidden");
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

    // removing the old canvas
    content.forEach((section) => section.classList.add("hidden"));
    const content2Clone = content[2].cloneNode(true);
    content[2].remove();
    content2Clone.classList.remove("hidden");
    content[0].parentElement.append(content2Clone);

    // start the game
    startGame(players);
  }
});

function startGame(players) {
  const canvas = document.getElementById("canvas");
  const game = new Game(canvas, canvas.offsetWidth - 400, canvas.offsetHeight);
  game.start(players);
}
