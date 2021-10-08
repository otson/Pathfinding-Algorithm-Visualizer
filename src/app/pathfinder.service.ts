import {Injectable} from '@angular/core';
import {Cell} from "./shared/cell.model";
import {Response} from "./shared/response.model";
import {MazeGeneratorService} from "./maze-generator.service";

@Injectable({
  providedIn: 'root'
})
export class PathfinderService {

  lines = [ // here
    {x1: 85.31, y1: 9.67, x2: 98.23, y2: 9.67}
  ];

  private rows: number = 25;
  private columns: number = 44;
  private map: Cell[][] = [];

  private timeouts: number[] = [];

  public diagonalMovement = false;

  public algorithmDescription = "Select an algorithm from the downdown menu. Draw walls with mouse.";
  public selectedAlgorithm = '';

  constructor(private mazeGeneratorService: MazeGeneratorService) {
    this.setup();
  }

  execute() {
    if(this.selectedAlgorithm == 'bfs') this.solveBreadthFirst();
    if(this.selectedAlgorithm == 'dfs') this.solveDepthFirst();
    if(this.selectedAlgorithm == 'bestFirst') this.solveBestFirst();
    if(this.selectedAlgorithm == 'a*') this.solveAStar();
  }

  private animate(solution: Response) {
    for (let i = 0; i < solution.traversal.length; i++) {
      this.timeouts.push(setTimeout(function () {
        let cell = solution.traversal[i];
        let elem = document.getElementById(cell.column + "-" + cell.row);
        elem?.classList.add('visited');
      }, 25 * i));
      if (i == solution.traversal.length - 1) {
        for (let j = 0; j < solution.path.length; j++) {
          this.timeouts.push(setTimeout(function () {
            let cell = solution.path[j];
            let elem = document.getElementById(cell.column + "-" + cell.row);
            elem?.classList.add('path');
          }, 25 * i + 50 * j));
        }
      }
    }

    this.lines = [];
    for (let i = 1; i < solution.path.length; i++) {
      let start = document.getElementById(solution.path[i - 1].column + "-" + solution.path[i - 1].row)!;
      let end = document.getElementById(solution.path[i].column + "-" + solution.path[i].row)!;
      this.lines.push(
        {
          x1: start.getBoundingClientRect().left,
          y1: start.getBoundingClientRect().top,
          x2: end.getBoundingClientRect().left,
          y2: end.getBoundingClientRect().top,
        }
      )
    }
  }

  solveBreadthFirst() {
    this.resetPath();
    this.animate(this.breadthFirst(this.diagonalMovement));
  }

  solveAStar() {
    this.resetPath();
    this.animate(this.aStar(this.diagonalMovement));
  }

  solveBestFirst() {
    this.resetPath();
    this.animate((this.aStar(this.diagonalMovement,
      (start: Cell, end: Cell) => this.euclidean(start, end) * 1000000)));
  }

  solveDepthFirst() {
    this.resetPath();
    this.animate((this.breadthFirst(this.diagonalMovement, true)));
  }

  resetPath() {
    this.clear();
    let visited = document.getElementsByClassName('visited');
    while (visited.length > 0) {
      visited[0].classList.remove('path');
      visited[0].classList.remove('visited');
    }
    while (this.timeouts.length > 0) {
      clearTimeout(this.timeouts.pop());
    }
  }

  public clear() {
    for (let row of this.map) {
      for (let cell of row) {
        cell.isVisited = false;
        cell.isClosed = false;
      }
    }
  }

  public clearWalls() {
    for (let row of this.map) {
      for (let cell of row) {
        cell.isWall = false;
      }
    }
    this.resetPath();
    let walls = document.getElementsByClassName('wall');
    while (walls.length > 0) {
      walls[0].classList.remove('wall');
    }
  }

  public setup() {
    this.map = [];
    for (let row = 0; row < this.rows; row++) {
      let currRow = [];
      for (let column = 0; column < this.columns; column++) {
        currRow.push(
          new Cell(column, row,
            row == Math.trunc(this.rows / 2) && column == Math.trunc(this.columns / 4),
            row == Math.trunc(this.rows / 2) && column == Math.trunc(this.columns / 4 * 3),
            false, false, undefined,
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

  private manhattan(start: Cell, end: Cell) {
    return Math.abs(start.column - end.column) +
      Math.abs(start.row - end.row);
  }

  private euclidean(start: Cell, end: Cell) {
    return (Math.sqrt(
      Math.pow(start.row - end.row, 2) +
      Math.pow(start.column - end.column, 2)
    )); //;+ 0.0001 * start.row + 0.00001 * start.column;
  }

  private aStar(diagonalMovement: boolean, heuristic?: (start: Cell, end: Cell) => number): Response {

    let h = diagonalMovement ? this.euclidean : this.manhattan;
    if (heuristic != undefined) h = heuristic;

    function getNeighbors(curr: Cell, map: Cell[][], diagonalMovement: boolean) {
      let neighbors = [];
      if (curr.row > 0) neighbors.push(map[curr.row - 1][curr.column]);
      if (curr.column < map[0].length - 1) neighbors.push(map[curr.row][curr.column + 1]);
      if (curr.row < map.length - 1) neighbors.push(map[curr.row + 1][curr.column]);
      if (curr.column > 0) neighbors.push(map[curr.row][curr.column - 1]);

      if (diagonalMovement) {
        if (curr.row > 0 && curr.column > 0) neighbors.push(map[curr.row - 1][curr.column - 1]);
        if (curr.row > 0 && curr.column < map[0].length - 1) neighbors.push(map[curr.row - 1][curr.column + 1]);
        if (curr.row < map.length - 1 && curr.column < map[0].length - 1) neighbors.push(map[curr.row + 1][curr.column + 1]);
        if (curr.row < map.length - 1 && curr.column > 0) neighbors.push(map[curr.row + 1][curr.column - 1]);
      }
      return neighbors;
    }

    const response = new Response();
    let start = this.getStart();
    let end = this.getEnd();
    let openSet: Cell[] = [];
    let gScore = new Map();
    let fScore = new Map();
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        gScore.set(this.map[row][column], Infinity);
        fScore.set(this.map[row][column], Infinity);
      }
    }
    start.isVisited = true;
    openSet.push(start);
    gScore.set(start, 0);
    fScore.set(start, h(start, end));
    while (openSet.length > 0) {
      // get node with lowest f value;
      let curr = openSet[0];
      for (let i = 1; i < openSet.length; i++) {
        if (fScore.get(curr) > fScore.get(openSet[i])) {
          curr = openSet[i];
        }
      }
      openSet = openSet.filter((item) => item !== curr);
      curr.isClosed = true;

      if (curr === end) {
        while (curr.parent != undefined) {
          response.path.push(curr);
          curr = curr.parent;
        }
        break;
      }
      for (let neighbor of getNeighbors(curr, this.map, diagonalMovement)) {
        if (neighbor.isWall || neighbor.isClosed) continue;
        let tentativeGScore = gScore.get(curr) + ((curr.column === neighbor.column || curr.row === neighbor.row) ? 1 : Math.sqrt(2));
        if (!neighbor.isVisited || tentativeGScore < gScore.get(neighbor)) {
          neighbor.parent = curr;
          gScore.set(neighbor, tentativeGScore);
          fScore.set(neighbor, tentativeGScore + h(neighbor, end));
          if (!neighbor.isVisited) {
            response.traversal.push(neighbor);
            openSet.push(neighbor);
            neighbor.isVisited = true;
          } else {
            openSet = openSet.filter((item) => item !== neighbor);
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
  private breadthFirst(diagonalMovement: boolean, dfs: boolean = false): Response {
    const response = new Response();
    let start: Cell = this.getStart();
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j].isStart) {
          start = this.map[i][j];
          break;
        }
      }
    }
    let q: Cell[] = [];
    q.push(start);
    while (q.length != 0) {
      let parent: Cell = dfs ? q.pop()! : q.shift()!;
      parent.isVisited = true;
      response.traversal.push(parent);
      if (parent.isEnd) {
        while (parent.parent != undefined) {
          response.path.push(parent);
          parent = parent.parent;
        }
        break;
      }
      this.processNeighbor(parent, parent.row, parent.column + 1, q);
      if (diagonalMovement) this.processNeighbor(parent, parent.row + 1, parent.column + 1, q);
      this.processNeighbor(parent, parent.row + 1, parent.column, q);
      if (diagonalMovement) this.processNeighbor(parent, parent.row + 1, parent.column - 1, q);
      this.processNeighbor(parent, parent.row, parent.column - 1, q);
      if (diagonalMovement) this.processNeighbor(parent, parent.row - 1, parent.column - 1, q);
      this.processNeighbor(parent, parent.row - 1, parent.column, q);
      if (diagonalMovement) this.processNeighbor(parent, parent.row - 1, parent.column + 1, q);
    }
    return response;
  }

  private getStart() {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j].isStart) {
          return this.map[i][j];
        }
      }
    }
    return this.map[0][0];
  }

  private getEnd() {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j].isEnd) {
          return this.map[i][j];
        }
      }
    }
    return this.map[0][0];
  }

  private processNeighbor(parent: Cell, row: number, column: number, q: Cell[]) {
    if (row < 0 || column < 0 || row >= this.rows || column >= this.columns) return;
    let child = this.map[row][column];
    if (child.isVisited || child.isWall) return;
    child.isVisited = true;
    child.parent = parent;
    q.push(child);
  }


  generateMaze() {
    let generating = true;
    while (generating) {
      let maze = this.mazeGeneratorService.generateMaze(this.columns, this.rows);
      for (let i = 0; i < this.map.length; i++) {
        for (let j = 0; j < this.map[i].length; j++) {
          if (!this.map[i][j].isEnd && !this.map[i][j].isStart) {
            this.map[i][j].isWall = maze[i][j] == 1;
          }
        }

        this.clear();
        generating = this.breadthFirst(false).path.length == 0;
      }
    }
  }

  getLines() {
    return this.lines;
  }

}
