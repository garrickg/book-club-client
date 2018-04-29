import gql from 'graphql-tag';

export const addBookMutation = gql`
  mutation ($title: String!, $image: String!, $author: String!) {
    addBook(title: $title, image: $image, author: $author) {
      ok
    }
  }
`;

export const myBooksQuery = gql`
  query ($userId: String!) {
    myBooks(userId: $userId) {
      title
      id
      image
    }
  }
`;

export const allBooksQuery = gql`
  query {
    allBooks {
      title
      id
      image
    }
  }
`;

export const registerMutation = gql`
  mutation ($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
      token
      refreshToken
      user {
        username
        id
      }
    }
  }
`;

export const loginMutation = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
      token
      refreshToken
      user {
        username
        id
      }
    }
  }
`;

export const meQuery = gql`
  query {
    me {
      id
      username
      city
      state
    }
  }
`;

export const updateUserMutation = gql`
  mutation ($username: String!, $city: String!, $state: String!) {
    updateUser(username: $username, city: $city, state: $state) {
      ok
    }
  }
`;