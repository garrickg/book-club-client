import { environment } from './../environments/environment';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {Apollo, ApolloModule} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloLink, from, split } from 'apollo-link';

@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphQLModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {

  const uri = `${environment.NG_APP_SERVER_URL}/graphql`;
  const http = httpLink.create({ uri });

  const middlewareLink = setContext(() => ({
    headers: {
      'x-token': localStorage.getItem('token') || "",
      'x-refresh-token': localStorage.getItem('refreshToken') || "",
    },
  }));

  const afterwareLink = new ApolloLink((operation, forward) =>
    forward(operation).map((response) => {
      const context = operation.getContext();
      const { response: { headers } } = context;

      if (headers) {
        const token = headers.get('x-token');
        const refreshToken = headers.get('x-refresh-token');

        if (token) {
          localStorage.setItem('token', token);
        }
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
      }
      return response;
  }));

  const linkWithMiddleware = from([middlewareLink, http]);

    apollo.create({
      link: linkWithMiddleware,
      cache: new InMemoryCache()
    });
  }
}