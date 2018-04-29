import { Book } from './../shared/book.model';
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { allBooksQuery } from '../shared/graphql';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  loading: boolean;
  books: Book[];
  numBooks: number;
  pageSize = 50;
  currentPage = 1;
  booksToDisplay: Book[];

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: allBooksQuery
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.books = [...data.allBooks];
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
