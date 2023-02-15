import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { ResponsiveHeaderDirective } from './custom-header/responsive-header.directive';
import { MainPageComponent } from './main-page.component';

@NgModule({
  imports: [NgbModalModule, CommonModule, RouterModule],
  declarations: [
    MainPageComponent,
    CustomHeaderComponent,
    ResponsiveHeaderDirective,
  ],
  providers: [],
})
export class MainPageModule {}
