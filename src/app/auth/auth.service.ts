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
  	this.http.post<{token: string}>('http://localhost:8000/api/user/login', authdata)
  		.subscribe(response => {
  			console.log(response);
  			this.token = response.token;
  			if (this.token){
  				this.isAuthenticated = true;
  				this.authStatusListner.next(true);
  				this.router.navigate(['/']);
  			}
  		});
  }

  logout(){
  	this.token = null;
  	this.isAuthenticated = false;
  	this.authStatusListner.next(false);
  	this.router.navigate(['/']);
  }
}
