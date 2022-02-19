import { Cell } from "./Cell";
import { Grid } from "./Grid";
import "./styles/index.scss";

export const grid = new Grid();
grid.draw();
console.log(grid.grid);
