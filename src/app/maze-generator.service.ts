import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MazeGeneratorService {

  private initialPercentage = 0.75; // Start with 25% cells being alive
  private iterations = 25;
  private survive = new Set([1,2,3,4]);
  private birth = new Set([3]);

  constructor() {}

  public generateMaze(width: number, height: number){


    let grid: number[][] = [];
    for(let i = 0; i < height; i++){
      grid.push([]);
      for(let j = 0; j < width; j++){
        grid[i][j] = Math.random() > this.initialPercentage ? 1 : 0;
      }
    }

    for(let iteration = 0; iteration < this.iterations; iteration++){
      this.advance(grid);
    }
    return grid;
  }

  private advance(grid: number[][]) {
    let neighbors: number[][] = Array.from(Array(grid.length), () => new Array(grid[0].length));
    for(let row of neighbors){
      row.fill(0);
    }
    for(let i = 0; i < grid.length; i++){
      for(let j = 0; j < grid[0].length; j++){
        if(i > 0 && j > 0) neighbors[i][j] += grid[i-1][j-1];
        if(i > 0) neighbors[i][j] += grid[i-1][j];
        if(j > 0) neighbors[i][j] += grid[i][j-1];
        if(i < grid.length - 1 && j < grid[0].length -1) neighbors[i][j] += grid[i+1][j+1];
        if(i < grid.length - 1) neighbors[i][j] += grid[i+1][j];
        if(j < grid[0].length - 1) neighbors[i][j] += grid[i][j+1];
        if(i > 0 && j < grid[0].length -1) neighbors[i][j] += grid[i-1][j+1];
        if(i < grid.length - 1 && j > 0) neighbors[i][j] += grid[i+1][j-1];
      }
    }

    for(let i = 0; i < grid.length; i++){
      for(let j = 0; j < grid[0].length; j++){
        if(grid[i][j] == 0) grid[i][j] = this.birth.has(neighbors[i][j]) ? 1 : 0;
        else grid[i][j] = this.survive.has(neighbors[i][j]) ? 1 : 0;
      }
    }
  }
}
