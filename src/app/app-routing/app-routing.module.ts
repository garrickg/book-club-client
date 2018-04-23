import { HomeComponent } from './../home/home.component';
import { BookRemoveComponent } from './../books/book-remove/book-remove.component';
import { BookDetailComponent } from './../books/book-detail/book-detail.component';
import { BookAddComponent } from './../books/book-add/book-add.component';
import { BookListComponent } from './../books/book-list/book-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from '../auth/register/register.component';
import { LoginComponent } from '../auth/login/login.component';
import { BooksComponent } from '../books/books.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'books', component: BooksComponent, children: [
    // { path: '', component: BookListComponent },
    { path: 'new', component: BookAddComponent },
    { path: ':id', component: BookDetailComponent },
    { path: ':id/remove', component: BookRemoveComponent }
  ]}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
