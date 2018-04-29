import { addBookMutation, myBooksQuery, allBooksQuery } from './../shared/graphql';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

@Injectable()
export class BookService {

  constructor(private apollo: Apollo) { }

  addBook (data, user) {
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
        variables: {
          userId: user.id,
        }
      }, {
        query: allBooksQuery
      }]
    }).subscribe(({ data }) => {},(error) => {
      console.log('there was an error adding the book', error);
    });
  }

}
