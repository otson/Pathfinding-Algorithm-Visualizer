import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../app.service";

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
  public isWall: boolean = false;
  @Input() public row: number = 0;
  @Input() public column: number = 0;
  @Input() public isStart: boolean = false;
  @Input() public isEnd: boolean = false;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
  }

  mouseEnter() {
    if(this.appService.isPainting){
      this.isWall = !this.isWall;
    }
  }

  getId() {
    return this.row + "-" +this.column;
  }
}
