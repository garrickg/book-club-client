import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';

const AllBooksQuery = gql`
query {
    allBooks {
      title
      author
      id
    }
  }
`;

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.query({query: AllBooksQuery}).subscribe(console.log);
  }
}

