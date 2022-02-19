import { Cell } from "./Cell";

export class Grid {
	ctx;
	canvas: HTMLCanvasElement;
	rows: number;
	cellSize: number;
	grid: Array<Array<Cell>>;
	openSet: Array<Cell>;
	closedSet: Array<Cell>;
	constructor() {
		const canvas = document.querySelector("canvas")!;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;
		this.rows = 5;
		this.cellSize = canvas.height / this.rows;
		this.grid = this.setupGrid();
		this.openSet = [];
		this.closedSet = [];
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
	draw() {
		this.drawGrid();
	}
	drawGrid() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.strokeStyle = "#000000";

		for (let i = 0; i <= this.rows; i++) {
			this.ctx.moveTo(0, i * this.cellSize);
			this.ctx.lineTo(this.canvas!.width, i * this.cellSize);

			this.ctx.moveTo(i * this.cellSize, 0);
			this.ctx.lineTo(i * this.cellSize, this.canvas.height);
		}
		this.ctx.stroke();
	}
}
