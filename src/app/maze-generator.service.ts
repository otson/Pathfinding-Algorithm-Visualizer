import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MazeGeneratorService {

  private N = 1;
  private E = 2;
  private S = 4;
  private W = 8;
  private DX = new Map([
    [this.E, 1],
    [this.W, -1],
    [this.N, 0],
    [this.S, 0],
  ]);
  private DY = new Map([
    [this.E, 0],
    [this.W, 0],
    [this.N, -1],
    [this.S, 1],
  ]);
  private opposite = new Map([
    [this.E, this.W],
    [this.W, this.E],
    [this.N, this.S],
    [this.S, this.N],
  ]);


  constructor() {}

  private carvePassages(cx: number, cy: number, grid: number[][]){
    let directions: number[] =  this.shuffleArray([this.N,this.E,this.S,this.W]);
    for(let direction of directions){
      const nx = cx + this.DX.get(direction)!
      const ny = cy + this.DY.get(direction)!
      if(ny >= 0 && nx >= 0 && nx < grid.length && ny < grid[0].length && grid[nx][ny] == 0){
        grid[cx][cy] += direction;
        grid[nx][ny] += this.opposite.get(direction)!;
        this.carvePassages(nx, ny, grid);
      }
    }
    return grid;
  }

  public generateMaze(sx: number, sy: number, width: number, height: number){
    let grid: number[][] = [];
    for(let i = 0; i < height; i++){
      grid.push([]);
      for(let j = 0; j < width; j++){
        grid[i][j] = 0;
      }
    }
    return this.carvePassages(sx, sy, grid);
  }

  private shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
