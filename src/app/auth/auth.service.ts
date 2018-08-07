import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private token: string;
	private authStatusListner = new Subject<boolean>();

  constructor(private http: HttpClient ) { }

  getToken(){
  	return this.token;
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
  			this.authStatusListner.next(true);
  		});
  }

  logout(){
  	this.token = null;
  	this.authStatusListner.next(false);
  }
}
