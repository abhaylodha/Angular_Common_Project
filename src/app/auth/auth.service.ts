import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DataStorageService } from '../shared/data-storage.service';
import { error } from 'protractor';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
    //Same as subject, but can be used to get last emitted value without even subscribing.
    user = new BehaviorSubject<User>(null);
    private logoutTimer: any;
    isUserAdmin = false;
    adminFlagchanged = new Subject<boolean>();

    token: string = null;
    constructor(private http: HttpClient,
        private router: Router,
        private dataSvc: DataStorageService) { }

    //Sign Up URL
    //Template : https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
    //Actual : https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD_pxwEL_BK3GBldh4hC4gNQT5Ugf-LLJM

    //Sign In URL
    //Template : https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
    //Actual : https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD_pxwEL_BK3GBldh4hC4gNQT5Ugf-LLJM

    setIsAdmin(isAdmin) {
        this.isUserAdmin = isAdmin;
        this.adminFlagchanged.next(this.isUserAdmin);
    }

    isAdmin() {
        return this.isUserAdmin;
    }

    updatePassword(email: string, password: string, updateSessionData: boolean) {

        return this.http
            .post<AuthResponseData>(environment.updatePasswordUrl + environment.apiKey,
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            .pipe(catchError(err => { return this.handleError(err) }), tap(resData => {
                if (updateSessionData)
                    this.handleAuthentication(resData.email,
                        resData.localId,
                        resData.idToken,
                        +resData.expiresIn);
            }));
    }

    signup(email: string, password: string, updateSessionData: boolean) {

        return this.http
            .post<AuthResponseData>(environment.signupUrl + environment.apiKey,
                {
                    email: email,
                    username: email,
                    password: password,
                    returnSecureToken: true
                })
            .pipe(catchError(err => { return this.handleError(err) }), tap(resData => {
                if (updateSessionData)
                    this.handleAuthentication(resData.email,
                        resData.localId,
                        resData.idToken,
                        +resData.expiresIn);
            }));
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(environment.loginUrl + environment.apiKey,
                {
                    email: email,
                    username: email,
                    password: password,
                    returnSecureToken: true
                }
            )
            .pipe(catchError(err => { return this.handleError(err) }), tap(resData => {
                this.handleAuthentication(resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn);
            }));
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        this.setIsAdmin(false);

        if (this.logoutTimer) {
            clearTimeout(this.logoutTimer);
        }
        this.logoutTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.logoutTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {

        const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
        const user = new User(email,
            userId,
            token,
            expirationDate);

        this.token = token;
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));

        this.autoLogout(expiresIn * 1000);
    }

    autoLogin() {

        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));

        if (userData) {
            let savedUser = new User(
                userData.email,
                userData.id,
                userData._token,
                new Date(userData._tokenExpirationDate)
            );

            if (savedUser.Token) {
                this.user.next(savedUser);
                let expiresIn = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.autoLogout(expiresIn);
            }

            this.dataSvc.isUserAnAdmin(userData.email).subscribe(
                response => {
                    this.setIsAdmin(response);
                }
            );
        }
    }

    private handleError(err: HttpErrorResponse) {

        let errorMsg = 'An unknown error occurred.';

        if (!err.error || !err.error.error) {
            return throwError(errorMsg);
        }
        switch (err.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMsg = 'Email already exists !!!';
                break;
            case 'INVALID_PASSWORD':
                errorMsg = 'Invalid password !!!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMsg = 'Email ID does not exist !!! Please sign up.';
                break;
        }

        return throwError(errorMsg);
    }
}
