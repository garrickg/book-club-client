import { User } from './../shared/user.model';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import * as decode from 'jwt-decode';
import { Subject } from 'rxjs/Subject';

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
      user {
        username
        id
      }
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
      user {
        username
        id
      }
    }
  }
`;

@Injectable()
export class AuthService {
  user = new Subject<User>();

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

  getUserObservable() {
    return this.user.asObservable();
  }

  emitUser(user: User) {
    if (!user) {
      const token = localStorage.getItem('token');
      user = decode(token)['user'];
    }
    this.user.next(user);
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
      const { ok, token, refreshToken, errors, user } = data.register;
      if (ok) {
        this.emitUser(user);
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
      const { ok, token, refreshToken, errors, user } = data.login;;
      if (ok) {
        this.emitUser(user);
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
    this.user.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.apollo.getClient().resetStore();
    this.router.navigate(['/']);
  }
}
