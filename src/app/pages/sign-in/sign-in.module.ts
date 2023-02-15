import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in.component';

const routes: Routes = [
  {
    path: '',
    component: SignInComponent,
  },
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  exports: [SignInComponent],
  declarations: [SignInComponent],
  providers: [],
})
export class SignInModule {}
