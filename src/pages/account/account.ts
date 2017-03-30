import { Component, OnDestroy } from '@angular/core';
import { NavController } from "ionic-angular";

import { Account, Cinema } from './../../store/models';

import { Subscription } from "rxjs/Subscription";
import { Store } from "@ngrx/store";
import { State } from "./../../store";
import * as actionsAccount from './../../store/actions/account';
import * as selectors from './../../store/selectors';

import { CinemasPage } from './../cinemas/cinemas';

import { Observable } from "rxjs/Observable";

@Component({
    selector: 'page-account',
    templateUrl: 'account.html'
})
export class AccountPage implements OnDestroy {

    public loading$: Observable<boolean>;

    public account: Account;
    public cinema: Cinema;

    private subscription: Subscription = new Subscription();

    constructor(
        private navCtrl: NavController,
        private store: Store<State>
    ) {
        this.loading$ = this.store.select(selectors.getAccountUpdating);

        let s = this.store.select(selectors.getAccount)
            .withLatestFrom(this.store.select(selectors.getCinemaEntities))
            .withLatestFrom(this.store.select(selectors.getCinemaCurrentId))
            .subscribe(([[account, cinemas], cinemaCurrentId]) => this.onAccountChange(account, cinemas[cinemaCurrentId]));

        this.subscription.add(s);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onAccountChange(account, cinema) {
        if (!account) {
            this.account = null;
            this.cinema = null;
            return;
        }

        this.account = account;
        this.cinema = cinema;
    }

    onNotifUpdates(checked: boolean) {
        this.store.dispatch(new actionsAccount.ChangeNotificationsAction({
            updates: checked,
        }));
    }

    onNotifTickets(checked: boolean) {
        this.store.dispatch(new actionsAccount.ChangeNotificationsAction({
            tickets: checked,
        }));
    }

    onCinemaChange() {
        this.navCtrl.push(CinemasPage);
    }

    logout() {
        this.subscription.unsubscribe();
        this.store.dispatch(new actionsAccount.LogoutAction());
    }

}
