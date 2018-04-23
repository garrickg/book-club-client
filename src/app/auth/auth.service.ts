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
      if (this.isAuthenticated()) {
        return decode(token);
      }
    } catch (err) {
      return null;
    }
  }

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
        this.setTokens(token, refreshToken).then(() => {
          this.router.navigate(['/']);
        });
      }
      this.router.navigate(['/']);
    },(error) => {
      console.log('there was an error sending the registration request', error);
    });
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
      if (ok) {
        this.setTokens(token, refreshToken).then(() => {
          this.router.navigate(['/']);
        });
      }
    },(error) => {
      console.log('there was an error sending the login request', error);
    });
  }

  setTokens (token, refreshToken) {
    return new Promise(function(resolve, reject) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      resolve();
    });
  }

  logout () {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/']);
  }
}
