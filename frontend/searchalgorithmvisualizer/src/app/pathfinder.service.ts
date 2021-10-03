import { Injectable } from '@angular/core';
import {Cell} from "./shared/cell.model";

@Injectable({
  providedIn: 'root'
})
export class PathfinderService {

  constructor() { }

  /**
   * Takes as an input a 2D grid of cells for which a path is to be found.
   * Returns an array of cells in the order in which they were visited when solving.
   */
  public solveDijkstra(cells:Cell[][]): Cell[]{
    const response = [];
    response.push(new Cell(2,3));
    response.push(new Cell(3,3));
    response.push(new Cell(3,4));
    return response;
  }
}
