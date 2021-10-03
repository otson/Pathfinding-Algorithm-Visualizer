import { Injectable } from '@angular/core';
import {Cell} from "./shared/cell.model";

@Injectable({
  providedIn: 'root'
})
export class PathfinderService {

  private rows: number = 15;
  private columns: number = 25;
  private map: Cell[][] = [];

  constructor() {
    for(let row = 0; row < this.rows; row++){
      let currRow = [];
      for(let column = 0; column < this.columns; column++){
        currRow.push(
          new Cell(column, row,
            row == Math.trunc(this.rows / 2) && column == Math.trunc(this.columns / 4),
            row == Math.trunc(this.rows / 2) && column == Math.trunc(this.columns / 4 * 3))
        );
      }
      this.map.push(currRow);
    }
  }

  public getMap(){
    return this.map;
  }

  /**
   * Takes as an input a 2D grid of cells for which a path is to be found.
   * Returns an array of cells in the order in which they were visited when solving.
   */
  public solveBreadthFirst(): Cell[]{
    const response: Cell[] = [];
    let start!: Cell;
    for(let i = 0; i < this.map.length; i++){
      for(let j = 0; j < this.map[i].length; j++){
        if(this.map[i][j].isStart) {
          start = this.map[i][j];
          break;
        }
      }
    }
    let q: (Cell | undefined)[] = [];
    q.push(start);
    while(q.length != 0){
      let cell: Cell = q.shift()!;
      if(cell == undefined || cell.isVisited) continue;
      cell.isVisited = true;
      response.push(cell);
      if(cell.isEnd) break;
      if(cell.row != 0) q.push(this.map[cell.row-1][cell.column]);
      if(cell.row != this.rows -1) q.push(this.map[cell.row+1][cell.column]);
      if(cell.column != 0) q.push(this.map[cell.row][cell.column-1]);
      if(cell.column != this.columns -1) q.push(this.map[cell.row][cell.column+1]);
    }
    return response;
  }
}
