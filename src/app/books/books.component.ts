import { Book } from './../shared/book.model';
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs/Subscription';

const allBooksQuery = gql`
  query {
    allBooks {
      title
      id
      image
    }
  }
`;

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  loading: boolean;
  books: Book[];

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
      });
  }
  
  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

}
