import { meQuery, updateUserMutation } from './../shared/graphql';
import { User } from './../shared/user.model';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  loading: boolean;
  user: User;

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: meQuery
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.user = data.me;
      });
  }

  onSubmit(form: NgForm) {
    this.user = { ...this.user, ...form.value };
    this.apollo.mutate({
      mutation: updateUserMutation,
      variables: {
        username: this.user.username,
        city: this.user.city,
        state: this.user.state,
      }
    }).subscribe(({ data }) => {
      console.log('got data', data);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

}
