import { Injectable } from '@angular/core';
import {Cell} from "./shared/cell.model";
import {Response} from "./shared/response.model";

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
  public solveBreadthFirst(): Response{
    const response = new Response();
    let start!: Cell;
    for(let i = 0; i < this.map.length; i++){
      for(let j = 0; j < this.map[i].length; j++){
        if(this.map[i][j].isStart) {
          start = this.map[i][j];
          break;
        }
      }
    }
    let q: Cell[] = [];
    q.push(start);
    while(q.length != 0){
      let parent: Cell = q.shift()!;
      if(parent.isVisited) continue;
      parent.isVisited = true;
      response.traversal.push(parent);
      if(parent.isEnd) {
        while(true){
          response.path.push(parent);
          if(parent.parent == undefined) break;
          parent = parent.parent;
        }
        break;
      }

      this.processNeighbor(parent, parent.row+1, parent.column, q);
      this.processNeighbor(parent, parent.row-1, parent.column, q);
      this.processNeighbor(parent, parent.row, parent.column+1, q);
      this.processNeighbor(parent, parent.row, parent.column-1, q);
    }
    console.log("Path length: "+response.path.length);
    return response;
  }

  private processNeighbor(parent: Cell, row: number, column: number, q : Cell[]){
    if(row < 0 || column < 0 || row >= this.rows || column >= this.columns) return;
    let child = this.map[row][column];
    if(child.isVisited || child.isWall) return;
    child.parent = parent;
    q.push(child);
  }
}
