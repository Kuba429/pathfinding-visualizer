import { color } from "./ColorHelper";
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
		this.color = color.blank;
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

		let potentialNeighbors = [
			{ x: this.x + 1, y: this.y },
			{ x: this.x - 1, y: this.y },
			{ x: this.x, y: this.y + 1 },
			{ x: this.x, y: this.y - 1 },
		];
		const diagonals = [
			{ x: this.x + 1, y: this.y + 1 },
			{ x: this.x + 1, y: this.y - 1 },
			{ x: this.x - 1, y: this.y + 1 },
			{ x: this.x - 1, y: this.y - 1 },
		];
		if (a.allowDiagonals)
			potentialNeighbors = potentialNeighbors.concat(diagonals);
		potentialNeighbors.forEach((cell) => {
			if (a.grid[cell.x] && a.grid[cell.x][cell.y]) {
				let neighbor = a.grid[cell.x][cell.y];
				!neighbor.isWall && neighbors.push(neighbor);
			}
		});

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

		// diagonals
		// if (this.x > 0 && this.y > 0) {
		// 	let cell = a.grid[this.x - 1][this.y - 1];
		// 	!cell.isWall && neighbors.push(cell);
		// }
		// if (this.x < a.rows - 1 && this.y > 0) {
		// 	let cell = a.grid[this.x + 1][this.y - 1];
		// 	!cell.isWall && neighbors.push(cell);
		// }
		// if (this.x > 0 && this.y < a.rows - 1) {
		// 	let cell = a.grid[this.x - 1][this.y + 1];
		// 	!cell.isWall && neighbors.push(cell);
		// }
		// if (this.x > a.rows - 1 && this.y < a.rows - 1) {
		// 	let cell = a.grid[this.x + 1][this.y + 1];
		// 	!cell.isWall && neighbors.push(cell);
		// }

		return neighbors;
	}
	makeWall() {
		this.isWall = true;
		this.color = color.wall;
	}
	makeNotWall() {
		this.isWall = false;
		this.color = color.blank;
	}
	draw() {
		a.ctx.fillStyle = this.color;
		a.ctx.fillRect(
			this.x * a.cellSize + 0.5,
			this.y * a.cellSize + 0.5,
			a.cellSize - 1,
			a.cellSize - 1
		);
	}
}
