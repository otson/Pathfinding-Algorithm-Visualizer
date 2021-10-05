import { Injectable } from '@angular/core';
import {Cell} from "./shared/cell.model";
import {Response} from "./shared/response.model";
import {MazeGeneratorService} from "./maze-generator.service";

@Injectable({
  providedIn: 'root'
})
export class PathfinderService {

  private rows: number = 15;
  private columns: number = 25;
  private map: Cell[][] = [];

  constructor(private mazeGeneratorService: MazeGeneratorService) {
    this.setup();
  }

  public clear(){
    for(let row of this.map){
      for(let cell of row){
        cell.isVisited = false;
      }
    }
  }

  public setup(){
    this.map = [];
    for(let row = 0; row < this.rows; row++){
      let currRow = [];
      for(let column = 0; column < this.columns; column++){
        currRow.push(
          new Cell(column, row,
            row == Math.trunc(this.rows / 2) && column == Math.trunc(this.columns / 4),
            row == Math.trunc(this.rows / 2) && column == Math.trunc(this.columns / 4 * 3),
            false, undefined,
            Math.trunc(this.rows / 4) < row && Math.trunc(this.rows / 4 * 3) > row && column == Math.trunc(this.columns / 2)
          )
        );
      }
      this.map.push(currRow);
    }
  }

  public getMap() {
    return this.map;
  }

  public solveAStar(): Response {
    function heuristic(start: Cell) {
      return Math.abs(start.column - end.column) +
        Math.abs(start.row -end.row);
    }

    function getNeighbors(curr: Cell, map: Cell[][]){
      let neighbors = [];
      if(curr.row > 0) neighbors.push(map[curr.row-1][curr.column]);
      if(curr.row < map.length - 1) neighbors.push(map[curr.row+1][curr.column]);
      if(curr.column > 0) neighbors.push(map[curr.row][curr.column-1]);
      if(curr.column < map[0].length - 1) neighbors.push(map[curr.row][curr.column+1]);
      return neighbors;
    }

    const response = new Response();
    let start = this.getStart();
    let end = this.getEnd();
    let openSet: Cell[] = [];
    let gScore = new Map();
    let fScore = new Map();
    for(let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        gScore.set(this.map[row][column], Infinity);
        fScore.set(this.map[row][column], Infinity);
      }
    }
    openSet.push(start);
    gScore.set(start, 0);
    fScore.set(start, heuristic(start));
    while(openSet.length > 0){
      // get node with lowest f value;
      let curr = openSet[0];
      for(let i = 1; i < openSet.length; i++){
        if(fScore.get(curr) > fScore.get(openSet[i])){
          curr = openSet[i];
        }
      }
      if(curr === end){
        while(curr.parent != undefined){
          response.path.push(curr);
          curr = curr.parent;
        }
        break;
      }
      openSet = openSet.filter((item) => item !== curr);
      for(let neighbor of getNeighbors(curr, this.map)){
        if(neighbor.isWall) continue;
        let tentativeGScore = gScore.get(curr) + 1;
        if(tentativeGScore < gScore.get(neighbor)){
          neighbor.parent = curr;
          gScore.set(neighbor, tentativeGScore);
          fScore.set(neighbor, tentativeGScore + heuristic(neighbor));
          if(openSet.filter((item) => item === curr).length == 0){
            response.traversal.push(neighbor);
            openSet.push(neighbor);
          }
        }
      }
    }

    return response;
  }

  /**
   * Takes as an input a 2D grid of cells for which a path is to be found.
   * Returns an array of cells in the order in which they were visited when solving.
   */
  public solveBreadthFirst(): Response{
    const response = new Response();
    let start: Cell = this.getStart();
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
        while(parent.parent != undefined){
          response.path.push(parent);
          parent = parent.parent;
        }
        break;
      }

      this.processNeighbor(parent, parent.row+1, parent.column, q );
      this.processNeighbor(parent, parent.row-1, parent.column, q);
      this.processNeighbor(parent, parent.row, parent.column+1, q);
      this.processNeighbor(parent, parent.row, parent.column-1, q);
    }
    return response;
  }

  private getStart(){
    for(let i = 0; i < this.map.length; i++){
      for(let j = 0; j < this.map[i].length; j++){
        if(this.map[i][j].isStart) {
          return this.map[i][j];
        }
      }
    }
    return this.map[0][0];
  }
  private getEnd(){
    for(let i = 0; i < this.map.length; i++){
      for(let j = 0; j < this.map[i].length; j++){
        if(this.map[i][j].isEnd) {
          return this.map[i][j];
        }
      }
    }
    return this.map[0][0];
  }

  private processNeighbor(parent: Cell, row: number, column: number, q : Cell[]){
    if(row < 0 || column < 0 || row >= this.rows || column >= this.columns) return;
    let child = this.map[row][column];
    if(child.isVisited || child.isWall) return;
    child.parent = parent;
    q.push(child);
  }


  generateMaze() {
    let start = this.getStart();
    let maze = this.mazeGeneratorService.generateMaze(start.column, start.row, this.columns, this.rows);
    console.log(maze);
    for(let i = 1; i < this.map.length-1; i++){
      for(let j = 1; j < this.map[i].length-1; j++) {
        if(!this.map[i][j].isEnd && maze[i][j] != 0) continue;
        if(maze[i][j] == 0) this.map[i][j+1].isWall = true;
        if(maze[i][j] == 5) this.map[i+1][j].isWall = true;
        if(maze[i][j] == 15) this.map[i-1][j].isWall = true;
        if(maze[i][j] == 20) this.map[i][j-1].isWall = true;
      }
    }
  }
}
