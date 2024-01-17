import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private usersUrl = 'assets/login/user.json';

  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string): Observable<boolean> {
    return this.http.get(this.usersUrl).pipe(
      map((data: any) => {
        const users = data.users;
        const user = users.find((u: any) => u.username === username && u.password === password);

        if (user) {
          // Autenticación exitosa
          return true;
        } else {
          // Autenticación fallida
          return false;
        }
      })
    );
  }

}
