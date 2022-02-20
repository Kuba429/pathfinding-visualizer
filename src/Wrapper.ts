import { Cell } from "./Cell";
import { a } from "./main";

export class Wrapper {
	ctx;
	canvas: HTMLCanvasElement;
	rows: number;
	cellSize: number;
	grid: Array<Array<Cell>>;
	start: Cell;
	target: Cell;
	openSet: Array<Cell>;
	closedSet: Array<Cell>;
	interval: any; // must be any from lack of better type
	constructor() {
		const canvas = document.querySelector("canvas")!;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;
		this.rows = 15;
		this.cellSize = canvas.height / this.rows;
		this.grid = this.setupGrid();
		this.start = this.grid[0][0];
		this.start.color = "#00ff00";
		this.target = this.grid[this.rows - 1][this.rows - 1];
		this.target.color = "#0000ff";
		this.openSet = [this.start];
		this.closedSet = [];
		this.interval = requestAnimationFrame(this.mainLoop);
	}

	algo() {
		if (this.openSet.length > 0) {
			let lowest = 0;
			for (let i = 0; i < this.openSet.length; i++) {
				if (this.openSet[i].f < this.openSet[lowest].f) {
					lowest = i;
				}
			}
			if (this.openSet[lowest] == this.target) {
				console.log("target found");
			}
			this.closedSet.push(this.openSet[lowest]);
			let current = this.openSet.splice(lowest, 1)[0];
			current.color = "#ff0000";
			current.neighbors.forEach((neighbor) => {
				if (!this.closedSet.includes(neighbor)) {
					let tempG = current.g + 1;
					if (this.openSet.includes(neighbor)) {
						if (tempG < neighbor.g) {
							neighbor.g = tempG;
						}
					} else {
						neighbor.g = tempG;
						this.openSet.push(neighbor);
						neighbor.color = "#00ff00";
					}
				}
			});
		} else {
			cancelAnimationFrame(this.interval);
			this.interval = undefined;
		}
	}
	mainLoop() {
		//functions passed to requestAnimationFrame can't read 'this' so must pass an actual object
		a.algo();
		a.draw();
		a.interval = requestAnimationFrame(a.mainLoop);
	}
	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.grid.flat().forEach((cell) => {
			cell.draw();
		});
		this.drawGrid();
	}
	drawGrid() {
		this.ctx.strokeStyle = "#000000";
		for (let i = 0; i <= this.rows; i++) {
			this.ctx.moveTo(0, i * this.cellSize);
			this.ctx.lineTo(this.canvas!.width, i * this.cellSize);

			this.ctx.moveTo(i * this.cellSize, 0);
			this.ctx.lineTo(i * this.cellSize, this.canvas.height);
		}
		this.ctx.stroke();
	}

	setupGrid(): Array<Array<Cell>> {
		let array = new Array(this.rows);
		for (let i = 0; i < array.length; i++) {
			array[i] = new Array(this.rows);
			for (let j = 0; j < array[i].length; j++) {
				array[i][j] = new Cell(i, j);
			}
		}
		return array;
	}
}
