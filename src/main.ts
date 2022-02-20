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
	const data = new FormData(form);
	const object = data.get("object");
	// if (object != "startPoint" && object != "destination") return;
	const x = Math.floor(e.offsetX / a.cellSize);
	const y = Math.floor(e.offsetY / a.cellSize);
	switch (object) {
		case "startPoint":
			a.newStartPoint(a.grid[x][y]);
			wallRadio.checked = true;
			break;
		case "destination":
			a.newDestination(a.grid[x][y]);
			wallRadio.checked = true;
			break;
		case "wall":
			a.grid[x][y].makeWall();
			break;
		case "eraseWall":
			a.grid[x][y].makeNotWall();
			break;
	}
	a.draw();
});
// smooth drawing walls
// can't apply smooth drawing to every option because it doesn't work with regular clicking
let mouseIsDown: boolean = false;
document.addEventListener("mousedown", () => {
	mouseIsDown = true;
});
document.addEventListener("mouseup", () => {
	mouseIsDown = false;
});
canvas.addEventListener("mousemove", (e) => {
	const data = new FormData(form);
	const object = data.get("object");
	if (object != "wall" && object != "eraseWall") return;
	if (!mouseIsDown) return;
	const x = Math.floor(e.offsetX / a.cellSize);
	const y = Math.floor(e.offsetY / a.cellSize);
	switch (object) {
		case "wall":
			if (a.grid[x][y] != a.start && a.grid[x][y] != a.target) {
				a.grid[x][y].makeWall();
			}
			break;
		case "eraseWall":
			if (a.grid[x][y].isWall) {
				a.grid[x][y].isWall = false;
				a.grid[x][y].color = "#ffffff";
			}
			break;
	}
	a.draw();
});
