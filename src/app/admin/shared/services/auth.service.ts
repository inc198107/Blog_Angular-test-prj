import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FirebaseAuthResponse, User } from '../../../shared/interfaces';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({providedIn: 'root'})

export class AuthService {

    public error$: Subject<string> = new Subject<string>()

    constructor(private http: HttpClient) { }

    get token(): string {
        const expiry = localStorage.getItem('fb-token-exp')
        if (Number(new Date()) > Number(expiry)) {
            this.logout();
            return null;
        }
        return localStorage.getItem('fb-token')
    }

    login(user: User): Observable<any> {
        user.returnSecureToken = true
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
            .pipe(
                tap(this.setToken),
                catchError(this.handleError.bind(this))
            )
    }

    logout() {
        this.setToken(null)
    }

    isAuthenticated(): boolean {
        return Boolean(this.token)
    }

    private handleError(error: HttpErrorResponse) {
        const { message } = error.error.error
        if (message) {
            console.log(message)
        }
        switch (message) {
            case 'EMAIL_NOT_FOUND':
                this.error$.next('Email not Found')
                break
            case 'INVALID_PASSWORD':
                this.error$.next('Invalid Password')
                break
            case 'INVALID_EMAIL':
                this.error$.next('Invalid Email')
                break
            default:
                break
        }
        return throwError(error)
    }

    private setToken(response: FirebaseAuthResponse | null) {
        if (response) {
            const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
            localStorage.setItem('fb-token', response.idToken);
            localStorage.setItem('fb-token-exp', expDate.toString());
        } else {
            localStorage.clear()
        }
    }
}