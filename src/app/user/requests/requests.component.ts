import { userAndRequestsQuery, removeRequestMutation, allBooksQuery, approveRequestMutation } from './../../shared/graphql';
import { Apollo } from 'apollo-angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit, OnDestroy {
  loading: boolean;
  myRequests = [];
  requestsForMe = [];

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: userAndRequestsQuery
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        const { myRequests, requestsForMe } = data.me;
        this.myRequests = myRequests.filter(request => {
          return request.active;
        });
        this.requestsForMe = requestsForMe.filter(request => {
          return request.active;
        });
      });
  }

  onCancelRequest(id: string) {
    this.apollo.mutate({
      mutation: removeRequestMutation,
      variables: {
        id,
      },
      refetchQueries: [{
        query: userAndRequestsQuery
      }, {
        query: allBooksQuery
      }]
    }).subscribe(() => {},(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  onApproveRequest(id: string) {
    this.apollo.mutate({
      mutation: approveRequestMutation,
      variables: {
        id,
      },
      refetchQueries: [{
        query: userAndRequestsQuery
      }]
    }).subscribe(() => {},(error) => {
      console.log('there was an error sending the query', error);
    });
  }
  
  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

}
