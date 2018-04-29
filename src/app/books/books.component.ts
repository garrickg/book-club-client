import { Book } from './../shared/book.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { allBooksQuery, requestBookMutation } from '../shared/graphql';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit, OnDestroy {

  private _success = new Subject<string>();

  loading: boolean;
  books: Book[] = [];
  numBooks: number;
  pageSize = 50;
  currentPage = 1;
  booksToDisplay: Book[];
  successMessage: string;

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    
    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);

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

  onRequest(book: Book) { // TODO: add follow-up query to refresh store
    this.apollo.mutate({
      mutation: requestBookMutation,
      variables: {
        id: book.id,
      }
    }).subscribe(({ data }) => {
      const { ok } = data.requestBook;
      if (ok) {
        console.log(book.id);
        this._success.next(`${book.title} requested.  Check your requests for updates.`);
      }}, (error) => {
        console.log('there was an error requesting the book', error);
      });
    }
  
  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

}
