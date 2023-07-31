import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    if (request.url != 'assets/config.json' && request.url != 'https://jsonip.com' && request.url.indexOf('CorpDrFileUpload') <= 0) {
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser && currentUser.token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      //this.authenticationService.refreshToken().then((res) => {
      //  currentUser.token = res.refreshedToken;
      //  localStorage.setItem('currentUser', JSON.stringify(currentUser));
      //});
    }

    return next.handle(request);
  }
}
