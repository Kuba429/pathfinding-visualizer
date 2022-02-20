import { a } from "./main";

export class Cell {
	x: number;
	y: number;
	g: number;
	isWall: boolean;
	color: string;
	previous: Cell | null;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.g = 0;
		this.isWall = false;
		this.color = "#ffffff";
		this.previous = null;
	}
	get f(): number {
		return this.g + this.h;
	}
	get h() {
		let addent1 = Math.pow(this.x - a.target.x, 2);
		let addent2 = Math.pow(this.y - a.target.y, 2);
		return Math.sqrt(addent1 + addent2);
	}
	get neighbors() {
		const neighbors = [];
		if (this.x > 0) {
			let cell = a.grid[this.x - 1][this.y];
			!cell.isWall && neighbors.push(cell);
		}
		if (this.x < a.rows - 1) {
			let cell = a.grid[this.x + 1][this.y];
			!cell.isWall && neighbors.push(cell);
		}
		if (this.y > 0) {
			let cell = a.grid[this.x][this.y - 1];
			!cell.isWall && neighbors.push(cell);
		}
		if (this.y < a.rows - 1) {
			let cell = a.grid[this.x][this.y + 1];
			!cell.isWall && neighbors.push(cell);
		}

		return neighbors;
	}
	toggleWall() {
		if (this.isWall) {
			this.isWall = false;
			this.color = "#ffffff";
		} else {
			this.isWall = true;
			this.color = "#000000";
		}
	}
	draw() {
		a.ctx.fillStyle = this.color;
		a.ctx.fillRect(
			this.x * a.cellSize,
			this.y * a.cellSize,
			a.cellSize,
			a.cellSize
		);
	}
}
