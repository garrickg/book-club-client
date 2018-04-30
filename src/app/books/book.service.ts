import { Book } from './../shared/book.model';
import { addBookMutation, myBooksQuery, allBooksQuery, removeBookMutation } from './../shared/graphql';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

@Injectable()
export class BookService {

  constructor(private apollo: Apollo) { }

  addBook (data) {
    const { volumeInfo: { title, authors, imageLinks: { thumbnail }}} = data;
    const author = authors[0];
    this.apollo.mutate({
      mutation: addBookMutation,
      variables: {
        title,
        author,
        image: thumbnail,
      },
      refetchQueries: [{
        query: myBooksQuery,
      }, {
        query: allBooksQuery
      }]
    }).subscribe(({ data }) => {},(error) => {
      console.log('there was an error adding the book', error);
    });
  }

  removeBook (book: Book) {
    this.apollo.mutate({
      mutation: removeBookMutation,
      variables: {
        id: book.id,
      },
      refetchQueries: [{
        query: myBooksQuery,
      }, {
        query: allBooksQuery
      }]
    }).subscribe(({ data }) => {},(error) => {
      console.log('there was an error removing the book', error);
    });
  }

}
