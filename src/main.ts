import { Wrapper } from "./Wrapper";
import "./styles/index.scss";
export const a = new Wrapper();
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");
const canvas = a.canvas;
const form: HTMLFormElement = document.querySelector("#mainForm")!;
a.draw();
startButton?.addEventListener("click", () => {
	a.interval = requestAnimationFrame(a.mainLoop);
});
resetButton?.addEventListener("click", () => {
	let tempStart = { x: a.start.x, y: a.start.y };
	let tempDestination = { x: a.target.x, y: a.target.y };
	a.grid = a.setupGrid();
	a.start = a.grid[tempStart.x][tempStart.y];
	a.target = a.grid[tempDestination.x][tempDestination.y];
	a.start.color = "#0000ff";
	a.target.color = "#0000ff";
	a.openSet = [a.start];
	a.draw();
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
			if (a.grid[x][y] != a.start) {
				a.target.color = "#000000";
				a.target = a.grid[x][y];
				a.target.color = "#0000ff";
			}
			break;
	}

	a.draw();
});
