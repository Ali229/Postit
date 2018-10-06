import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../_services';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
    if (localStorage['auth_token'] != '') {
      if (request.method === 'GET') {
        request = request.clone({
          setHeaders: this.authService.getGETHeaders()
        });
      } else {
        request = request.clone({
          setHeaders: this.authService.getPOSTPUTHeaders()
        });
      }
    }
    return next.handle(request);
  }
}
