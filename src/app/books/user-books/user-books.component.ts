import { User } from './../../shared/user.model';
import { AuthService } from './../../auth/auth.service';
import { Book } from '../../shared/book.model';
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs/Subscription';

const myBooksQuery = gql`
  query ($userId: String!) {
    myBooks(userId: $userId) {
      title
      id
      image
    }
  }
`;

@Component({
  selector: 'app-user-books',
  templateUrl: './user-books.component.html',
  styleUrls: ['./user-books.component.css']
})
export class UserBooksComponent implements OnInit {

  loading: boolean;
  books: Book[];
  user: User;

  private querySubscription: Subscription;

  constructor(private apollo: Apollo, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUserObservable()
      .subscribe(user => {
        this.user = user;
      });      
    this.authService.emitUser(null);


    this.querySubscription = this.apollo.watchQuery<any>({
      query: myBooksQuery,
      variables: {
        userId: this.user.id,
      },
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.books = [...data.myBooks];
      });
  }
  
  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

}
