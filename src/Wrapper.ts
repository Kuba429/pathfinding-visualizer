import { Cell } from "./Cell";
import { color } from "./ColorHelper";
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
	canModify: boolean;
	constructor() {
		const canvas = document.querySelector("canvas")!;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;
		this.rows = 5;
		this.cellSize = canvas.height / this.rows;
		this.grid = this.setupGrid();
		this.start = this.grid[0][0];
		this.start.color = color.start;
		this.target = this.grid[this.rows - 1][this.rows - 1];
		this.target.color = color.end;
		this.openSet = [this.start];
		this.closedSet = [];
		this.interval = null;
		this.canModify = true;
		this.drawGrid();
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
		let tempStart = { x: this.start.x, y: this.start.y };
		let tempDestination = { x: this.target.x, y: this.target.y };
		this.grid = this.setupGrid();
		this.newStartPoint(this.grid[tempStart.x][tempStart.y]);
		this.newDestination(this.grid[tempDestination.x][tempDestination.y]);
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
			current.neighbors.forEach((neighbor) => {
				if (!this.closedSet.includes(neighbor)) {
					let tempG = current.g + getGScore(current, neighbor);
					if (this.openSet.includes(neighbor)) {
						if (tempG < neighbor.g) {
							neighbor.g = tempG;
						}
					} else {
						neighbor.g = tempG;
						this.openSet.push(neighbor);
						if (neighbor != this.target && neighbor != this.start) {
							neighbor.color = color.openSet;
						}
					}
					neighbor.previous = current;
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
function getGScore(cell1: Cell, cell2: Cell): number {
	if (cell1.x == cell2.x || cell1.y == cell2.y) {
		return 10;
	} else {
		return 14;
	}
}
