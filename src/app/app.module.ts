import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CellComponent } from './cell/cell.component';
import { TopbarComponent } from './topbar/topbar.component';
import {CommonModule} from "@angular/common";
import { ButtonDropdownComponent } from './button-dropdown/button-dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    CellComponent,
    TopbarComponent,
    ButtonDropdownComponent
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
