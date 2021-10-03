export class Cell{
  constructor(public column: number, public row: number, public isStart: boolean = false, public isEnd: boolean = false,
              public isVisited: boolean = false, public parent?: Cell, public isWall: boolean = false){};
}
