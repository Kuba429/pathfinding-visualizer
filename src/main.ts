import { Wrapper } from "./Wrapper";
import "./styles/index.scss";
export const a = new Wrapper();
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");
const canvas = a.canvas;
const wallRadio: HTMLInputElement = document.querySelector("#wallRadio")!;
const form: HTMLFormElement = document.querySelector("#mainForm")!;
a.draw();
startButton?.addEventListener("click", () => {
	if (a.interval) return;
	a.interval = requestAnimationFrame(a.mainLoop);
});
resetButton?.addEventListener("click", () => {
	a.reset();
});
canvas.addEventListener("mousedown", (e) => {
	const x = Math.floor(e.offsetX / a.cellSize);
	const y = Math.floor(e.offsetY / a.cellSize);
	const data = new FormData(form);
	switch (data.get("object")) {
		case "wall":
			if (a.grid[x][y] != a.start && a.grid[x][y] != a.target) {
				a.grid[x][y].toggleWall();
			}
			break;
		case "startPoint":
			a.newStartPoint(a.grid[x][y]);
		case "destination":
			a.newDestination(a.grid[x][y]);
			break;
	}

	a.draw();
	wallRadio.checked = true;
});
