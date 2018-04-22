import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import * as decode from 'jwt-decode';

const registerMutation = gql`
  mutation ($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
      token
      refreshToken
    }
  }
`;

const loginMutation = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
      token
      refreshToken
    }
  }
`;

@Injectable()
export class AuthService {

  constructor(private router: Router, private apollo: Apollo) { }

  registerUser (username: string, email: string, password: string) {
    this.apollo.mutate({
      mutation: registerMutation,
      variables: {
        username,
        email,
        password,
      },
    }).subscribe(({ data }) => {
      const { ok, token, refreshToken, errors } = data.register;
      if (ok) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      }
      this.router.navigate(['/']);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  isAuthenticated () {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      decode(token);
      decode(refreshToken);
    } catch (err) {
      return false;
    }
    return true;
  }

  getUser () {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      const response = decode(token);
      return response.user;
    } catch (err) {
      return {};
    }
  }

  login (email: string, password: string) {
    this.apollo.mutate({
      mutation: loginMutation,
      variables: {
        email,
        password,
      },
    }).subscribe(({ data }) => {
      const { ok, token, refreshToken, errors } = data.login;
      if(ok){
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      }
      this.router.navigate(['/']);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  logout () {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/']);
  }
}
