import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const addBookMutation = gql`
  mutation ($title: String!, $image: String!) {
    addBook(title: $title, image: $image) {
      ok
    }
  }
`;

@Injectable()
export class BookService {

  constructor(private apollo: Apollo) { }

  addBook (data) {
    const { volumeInfo: { title, authors, imageLinks: { thumbnail }}} = data;
    this.apollo.mutate({
      mutation: addBookMutation,
      variables: {
        title,
        image: thumbnail,
      },
    }).subscribe(({ data }) => {},(error) => {
      console.log('there was an error adding the book', error);
    });
  }

}
