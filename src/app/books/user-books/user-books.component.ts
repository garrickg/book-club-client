import { BookService } from './../book.service';
import { myBooksQuery } from './../../shared/graphql';
import { User } from './../../shared/user.model';
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
  numBooks = 0;
  pageNums: number[] = [];
  pageSize = 18;
  currentPage = 1;
  booksToDisplay: Book[];

  private querySubscription: Subscription;

  constructor(private apollo: Apollo,private bookService: BookService) { }

  ngOnInit() {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: myBooksQuery,
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.pageNums = [];
        this.booksToDisplay = [];
        this.loading = loading;
        this.books = [...data.myBooks];
        this.numBooks = this.books.length;
        for (let i = 1; i <= Math.ceil(this.numBooks/this.pageSize); i++) {
          this.pageNums.push(i);
        }
        this.loadBooks(this.currentPage);
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

  onRemove(book: Book) {
    this.bookService.removeBook(book);
    this.loadBooks(this.currentPage);
  }
  
  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

}
