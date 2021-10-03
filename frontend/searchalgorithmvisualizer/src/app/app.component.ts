import { Component } from '@angular/core';
import {AppService} from "./app.service";
import {PathfinderService} from "./pathfinder.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private appService: AppService, private pathfinderService: PathfinderService) {
  }

  public getMap(){
    return this.pathfinderService.getMap();
  }

  stopPainting() {
    this.appService.isPainting = false;
  }

  startPainting() {
    this.appService.isPainting = true;
  }
}
