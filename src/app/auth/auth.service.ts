import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private token: string;
	private isAuthenticated = false;
	private authStatusListner = new Subject<boolean>();
	private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  getToken(){
  	return this.token;
  }

  getIsAuth(){
  	return this.isAuthenticated;
  }

  getAuthStatusListner(){
  	return this.authStatusListner.asObservable();
  }

  createUser(email: string, password: string){
  	const authdata: AuthData = {email: email, password: password};
  	this.http.post('http://localhost:8000/api/user/signup', authdata)
  		.subscribe(response => {
  			console.log(response);
  		});
  }

  login(email: string, password: string){
  	const authdata: AuthData = {email: email, password: password};
  	this.http.post<{token: string, expiresIn: number}>('http://localhost:8000/api/user/login', authdata)
  		.subscribe(response => {
  			console.log(response);
  			this.token = response.token;
  			if (this.token){
  				const expiresInDuration = response.expiresIn;
  				this.logoutTimer(expiresInDuration);
  				this.isAuthenticated = true;
  				this.authStatusListner.next(true);

  				const expirationDate = this.generateExpirationDate(expiresInDuration);

  				this.saveAuthData(this.token, expirationDate);
  				this.router.navigate(['/']);
  			}
  		});
  }

  logoutTimer(duration){
  	console.log('logout timer' + duration);
  	this.tokenTimer = setTimeout(() => {
  		this.logout();
  	}, duration * 1000);
  }

  logout(){
  	this.token = null;
  	this.isAuthenticated = false;
  	this.authStatusListner.next(false);
  	this.clearAuthData();
  	clearTimeout(this.tokenTimer);
  	this.router.navigate(['/']);
  }

  autoAuthUser(){
  	const authInfo = this.getAuthData();
  	
  	if (!authInfo){
  		return;
  	}
  	const now = new Date();
  	const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

  	if (expiresIn > 0){
  		this.token = authInfo.token;
  		this.isAuthenticated = true;
  		this.authStatusListner.next(true);
  		this.logoutTimer(expiresIn/1000);
  	}
  }

  generateExpirationDate(duration){
  	const now = new Date();
  	const expirationDate = new Date( now.getTime() + duration*1000 );
  	return expirationDate;
  }

  private saveAuthData(token: string, expirationDate: Date){
  	console.log(expirationDate);
  	localStorage.setItem('token', token);
  	localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private getAuthData(){
  	const token = localStorage.getItem('token');
  	const expirationDate = localStorage.getItem('expirationDate');	

  	if (!token || !expirationDate){
  		return;
  	}

  	return {
  		token: token,
  		expirationDate: new Date(expirationDate),
  	}
  }

  private clearAuthData(){
  	localStorage.removeItem('token');
  	localStorage.removeItem('expirationDate');	
  }
}
