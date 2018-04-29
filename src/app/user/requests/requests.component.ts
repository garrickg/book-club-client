import { userAndRequestsQuery } from './../../shared/graphql';
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
  userRequestData: any;

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: userAndRequestsQuery
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.userRequestData = data.me;
        console.log(this.userRequestData);
      });
  }
  
  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

}
