import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GraphQLModule } from './apollo.config';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BooksComponent } from './books/books.component';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { UserBooksComponent } from './books/user-books/user-books.component';
import { AddBookModalComponent } from './books/add-book-modal/add-book-modal.component';
import { BookService } from './books/book.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    BooksComponent,
    HeaderComponent,
    HomeComponent,
    UserBooksComponent,
    AddBookModalComponent,
  ],
  imports: [
    BrowserModule,
    GraphQLModule,
    AppRoutingModule,
    FormsModule,
    NgbModule.forRoot(),
    HttpModule,
  ],
  providers: [AuthService, BookService],
  bootstrap: [AppComponent]
})
export class AppModule { }
