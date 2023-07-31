import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../_models';

//const httpOptions = {
//    headers: new HttpHeaders({
//      'Content-Type': 'application/x-www-form-urlencoded'
//    })
//  };

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`${config.apiUrl}/users`);
  }

  getById(id: number) {
    return this.http.get(`${config.apiUrl}/users/` + id);
  }

  register(user: User) {
    return this.http.get(`${config.apiUrl}/users/`);

  }

  ValidateOTP(OTP: string, username: string, fk_PersonGlCode: string, varProjectCode: string): Promise<any> {
    var test = { OTP: OTP, varUserID: username, fk_PersonGlCode: fk_PersonGlCode, varProjectCode: varProjectCode };
    //var test = "OTP=" + OTP + "&varUserID=" + username + "&fk_PersonGlCode=" + fk_PersonGlCode + "";
    return new Promise((resolve, reject) => {
      this.http.post('api/Login/ValidateOTP', test, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }
  ReSendOTP(username: string, selection: string, fk_PersonGlCode: string, varPhoneEmail: string, varProjectCode: string): Promise<any> {
    var test1 = { username: username, selection: selection, fk_PersonGlCode: fk_PersonGlCode, varPhoneEmail: varPhoneEmail, varProjectCode: varProjectCode };
    //var test1 = "username=" + username + "&selection=" + selection + "&fk_PersonGlCode=" + fk_PersonGlCode + "&varPhoneEmail=" + varPhoneEmail + "";
    return new Promise((resolve, reject) => {
      this.http.post('api/Login/ResendOTP', test1, httpOptions)
        .subscribe((response: any) => {
          resolve(response);
        }, (error: any) => {
          reject(error);
        });
    });
  }



  update(user: User) {
    return this.http.put(`${config.apiUrl}/users/` + user.id, user);
  }

  delete(id: number) {
    return this.http.delete(`${config.apiUrl}/users/` + id);
  }
}
