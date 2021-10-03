import { Injectable } from '@angular/core';
import {Cell} from "./shared/cell.model";

@Injectable({
  providedIn: 'root'
})
export class PathfinderService {

  private rows: number = 35;
  private columns: number = 55;
  private map: Cell[][] = [];

  constructor() {
    for(let row = 0; row < this.rows; row++){
      let currRow = [];
      for(let column = 0; column < this.columns; column++){
        currRow.push(new Cell(column, row));
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
  public solveDijkstra(cells:Cell[][]): Cell[]{
    const response = [];
    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.columns; j++){
        response.push(new Cell(i,j));
      }
    }
    return response;
  }
}
