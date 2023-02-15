import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FindSessionsComponent } from './find-sessions.component';

const routes: Routes = [
  {
    path: '',
    component: FindSessionsComponent,
  },
];


@NgModule({
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
  exports: [FindSessionsComponent],
  declarations: [FindSessionsComponent],
  providers: [],
})
export class FindSessionsModule {}
