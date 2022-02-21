import { Cell } from "./Cell";
import { color } from "./ColorHelper";
import { a, diagonalsCheckbox, gridSizeRange } from "./main";

export class Wrapper {
	ctx;
	canvas: HTMLCanvasElement;
	rows: number;
	grid: Array<Array<Cell>>;
	start: Cell;
	target: Cell;
	openSet: Array<Cell>;
	closedSet: Array<Cell>;
	allowDiagonals: boolean;
	interval: any; // must be any from lack of better type
	canModify: boolean;
	constructor() {
		const canvas = document.querySelector("canvas")!;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;
		this.rows = parseInt(gridSizeRange.value);
		this.grid = this.setupGrid();
		this.start = this.grid[0][0];
		this.start.color = color.start;
		this.target = this.grid[this.rows - 1][this.rows - 1];
		this.target.color = color.end;
		this.openSet = [this.start];
		this.closedSet = [];
		this.allowDiagonals = diagonalsCheckbox.checked;
		this.interval = null;
		this.canModify = true;
	}
	get cellSize() {
		return this.canvas.height / this.rows;
	}
	newStartPoint(cell: Cell) {
		if (cell != this.target) {
			cell.color = color.start;
			this.start.color = color.blank;
			this.start = cell;
			this.start.isWall = false;
			this.openSet = [this.start];
		}
		this.draw();
	}
	newDestination(cell: Cell) {
		if (cell != this.start) {
			cell.color = color.end;
			this.target.color = color.blank;
			this.target = cell;
			this.target.isWall = false;
		}
		this.draw();
	}
	reset() {
		cancelAnimationFrame(this.interval);
		this.interval = null;
		this.grid = this.setupGrid();
		this.newStartPoint(this.grid[0][0]);
		this.newDestination(this.grid[this.rows - 1][this.rows - 1]);
		this.canModify = true;
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
				this.stop();

				this.recreatePath(this.target);
			}

			let current = this.openSet.splice(lowest, 1)[0];
			this.closedSet.push(current);

			if (current != this.target && current != this.start) {
				current.color = color.closedSet;
			}
			current.neighbors.forEach((neighbor: any) => {
				if (!this.closedSet.includes(neighbor)) {
					let tempG = current.g + getDistance(current, neighbor);
					if (this.openSet.includes(neighbor)) {
						if (tempG < neighbor.g) {
							neighbor.g = tempG;
							neighbor.previous = current;
						}
					} else {
						neighbor.g = tempG;
						neighbor.previous = current;
						this.openSet.push(neighbor);
						if (neighbor != this.target && neighbor != this.start) {
							neighbor.color = color.openSet;
						}
					}
				}
			});
		} else {
			this.stop();
		}
	}
	recreatePath(current: Cell) {
		if (current != this.target && current != this.start)
			current.color = color.path;
		current.draw();
		current.previous &&
			requestAnimationFrame(() => {
				this.recreatePath(current.previous!);
			});
	}
	stop() {
		cancelAnimationFrame(this.interval);
		this.interval = null;
	}
	mainLoop() {
		//functions passed to requestAnimationFrame can't read 'this' so must pass an actual object
		a.algo();
		a.draw();
		if (a.interval) {
			a.interval = requestAnimationFrame(a.mainLoop);
		}
	}
	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = color.grid;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.width);
		this.grid.flat().forEach((cell) => {
			cell.draw();
		});
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
	setRandomWalls() {
		this.reset();
		const allCells = this.grid.flat();
		const wallPercentage = 0.35;
		const amountOfWalls = Math.round(allCells.length * wallPercentage);
		for (let i = 0; i < amountOfWalls; i++) {
			const r1 = Math.floor(Math.random() * this.rows - 1) + 1;
			const r2 = Math.floor(Math.random() * this.rows - 1) + 1;
			if (
				a.grid[r1][r2] != this.start &&
				a.grid[r1][r2] != this.target &&
				!a.grid[r1][r2].isWall
			) {
				a.grid[r1][r2].makeWall();
			} else {
				i++;
			}
		}
		this.draw();
	}
}
export function getDistance(cell1: Cell, cell2: Cell): number {
	// if (a.allowDiagonals) {
	// 	let addent1 = Math.pow(cell1.x - cell2.x, 2);
	// 	let addent2 = Math.pow(cell1.y - cell2.y, 2);
	// 	return Math.sqrt(addent1 + addent2);
	// } else {
	// 	return Math.abs(cell1.x - cell2.x) + Math.abs(cell1.y - cell2.y);
	// }
	return Math.abs(cell1.x - cell2.x) + Math.abs(cell1.y - cell2.y);
}
