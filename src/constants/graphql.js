import gql from 'graphql-tag';

export const AllBooksQuery = gql`
query {
    allBooks {
      title
      author
      id
    }
  }
`;