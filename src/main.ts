import { Wrapper } from "./Wrapper";
import "./styles/index.scss";
export const a = new Wrapper();
const startButton = document.querySelector("#startButton");
const canvas = a.canvas;
a.draw();
startButton?.addEventListener("click", () => {
	a.interval = requestAnimationFrame(a.mainLoop);
});

canvas.addEventListener("mousedown", (e) => {
	const x = Math.floor(e.offsetX / a.cellSize);
	const y = Math.floor(e.offsetY / a.cellSize);
	a.grid[x][y].toggleWall();
	a.draw();
});
