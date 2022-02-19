export class Cell {
	x: number;
	y: number;
	color: string;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.color = "#ffffff";
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
}
