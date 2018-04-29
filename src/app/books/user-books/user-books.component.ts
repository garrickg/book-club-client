import { myBooksQuery } from './../../shared/graphql';
import { User } from './../../shared/user.model';
import { AuthService } from './../../auth/auth.service';
import { Book } from '../../shared/book.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user-books',
  templateUrl: './user-books.component.html',
  styleUrls: ['./user-books.component.css']
})
export class UserBooksComponent implements OnInit, OnDestroy {

  loading: boolean;
  books: Book[] = [];
  user: User;
  numBooks: number;
  pageSize = 50;
  currentPage = 1;
  booksToDisplay: Book[];

  private querySubscription: Subscription;

  constructor(private apollo: Apollo, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUserObservable()
      .subscribe(user => {
        this.user = user;
      });      
    this.authService.emitUser(null);
    this.querySubscription = this.apollo.watchQuery<any>({
      query: myBooksQuery,
      variables: {
        userId: this.user.id,
      },
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.books = [...data.myBooks];
        this.booksToDisplay = this.books.slice((1-this.currentPage)*this.pageSize, this.currentPage*this.pageSize-1);
        this.numBooks = this.books.length;
      });
  }

  loadBooks(page: number) {
    this.currentPage = page;
    if (this.currentPage*this.pageSize > this.numBooks) {
      this.booksToDisplay = this.books.slice((this.currentPage-1)*this.pageSize);
    } else {
      this.booksToDisplay = this.books.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize);
    }
  }
  
  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

}
