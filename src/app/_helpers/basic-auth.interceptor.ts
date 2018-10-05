import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../_services";

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
    if (this.authService.getUserID() && this.authService.getAuthToken()) {
      request = request.clone({
        headers: this.authService.getHeaders()
      });
    }

    return next.handle(request);
  }
}
