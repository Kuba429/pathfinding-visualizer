import { color } from "./ColorHelper";
import { a } from "./main";
import { getDistance } from "./Wrapper";

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
		return getDistance(this, a.target);
	}
	get neighbors() {
		const neighbors: any = [];

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
