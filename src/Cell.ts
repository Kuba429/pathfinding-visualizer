import { grid } from "./main";

export class Cell {
	x: number;
	y: number;
	color: string;
	previous: Cell | null;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.color = "#ffffff";
		this.previous = null;
	}
	get f(): number {
		return 0;
	}
	get h(): number {
		return 0;
	}
	get g(): number {
		return 0;
	}
	get neighbors() {
		const neighbors = [];
		if (this.x > 0) {
			neighbors.push(grid.grid[this.x - 1][this.y]);
		}
		if (this.x < grid.rows) {
			neighbors.push(grid.grid[this.x + 1][this.y]);
		}
		if (this.y > 0) {
			neighbors.push(grid.grid[this.x][this.y - 1]);
		}
		if (this.y < grid.rows) {
			neighbors.push(grid.grid[this.x][this.y + 1]);
		}

		return neighbors;
	}
}
