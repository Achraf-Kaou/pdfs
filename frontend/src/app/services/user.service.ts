import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { map, debounceTime, startWith } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private _filter = new FormControl('');
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const requestBody = {
      email,
      password
    };
    return this.http.post(`${this.baseUrl}/login`, requestBody, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
  })}

  /* count() : Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  } */

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  addUser(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  editUser(id: Object | undefined, user: User): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  deleteUser(id: Object | undefined): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
  }

  /* get filter(): FormControl {
    return this._filter;
  } */

  getUsersFiltered(filterValue: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`).pipe(
      map(users => users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`;
        return fullName.toLowerCase().includes(filterValue.toLowerCase());
      }))
    );
  }
}
