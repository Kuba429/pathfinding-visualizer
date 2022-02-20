import { Wrapper } from "./Wrapper";
import "./styles/index.scss";
//dom elements
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");
const randomWallsButton = document.querySelector("#randomWalls");
const canvas = document.querySelector("canvas")!;
const wallRadio: HTMLInputElement = document.querySelector("#wallRadio")!;
const form: HTMLFormElement = document.querySelector("#mainForm")!;
const gridSizeRange: HTMLInputElement =
	document.querySelector("#gridSizeRange")!;
export const diagonalsCheckbox: HTMLInputElement =
	document.querySelector("#diagonalsCheckbox")!;
//initialization & listeners
export const a = new Wrapper();
a.draw();
startButton?.addEventListener("click", () => {
	if (!a.canModify) return;
	a.canModify = false;
	a.interval = requestAnimationFrame(a.mainLoop);
});
resetButton?.addEventListener("click", () => {
	a.reset();
});
randomWallsButton?.addEventListener("click", () => {
	if (!a.canModify) return;
	a.setRandomWalls();
});
diagonalsCheckbox?.addEventListener("input", (e) => {
	if (!a.canModify) return;
	a.allowDiagonals = (<HTMLInputElement>e.target).checked;
});
gridSizeRange?.addEventListener("input", (e) => {
	if (!a.canModify) return;
	const value = parseInt((<HTMLInputElement>e.target).value);
	a.rows = value;
	a.reset();
	// a.ctx.clearRect(0, 0, canvas.width, canvas.height);
	// a.draw();
});
canvas.addEventListener("mousedown", (e) => {
	if (!a.canModify) return;
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
	if (!a.canModify) return;
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
				a.grid[x][y].makeNotWall();
			}
			break;
	}
	a.draw();
});
