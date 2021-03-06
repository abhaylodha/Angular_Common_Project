import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserDetailsService } from '../user-detail.service';
import { UserDetails } from '../user-details.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  userDetails: UserDetails[] = [];
  subscription: Subscription;
  filterString = '';

  constructor(private usrDtl: UserDetailsService) { }

  ngOnInit() {

    this.usrDtl.fetchUserList().subscribe((usrDetails) => { this.userDetails = usrDetails; });
    this.usrDtl.usersChanged.subscribe((usrDetails) => { this.userDetails = usrDetails; });

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
