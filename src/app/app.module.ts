import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { GraphQLModule } from './apollo.config';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BookItemComponent } from './books/book-item/book-item.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookAddComponent } from './books/book-add/book-add.component';
import { BookRemoveComponent } from './books/book-remove/book-remove.component';
import { BookCheckoutComponent } from './books/book-checkout/book-checkout.component';
import { BookCheckinComponent } from './books/book-checkin/book-checkin.component';
import { BooksComponent } from './books/books.component';
import { BookDetailComponent } from './books/book-detail/book-detail.component';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    BookItemComponent,
    BookListComponent,
    BookAddComponent,
    BookRemoveComponent,
    BookCheckoutComponent,
    BookCheckinComponent,
    BooksComponent,
    BookDetailComponent,
    HeaderComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    GraphQLModule,
    AppRoutingModule,
    FormsModule,
    NgbModule.forRoot(),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
