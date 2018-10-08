import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from "../_services";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  private loggedIn: boolean;

  constructor(private router: Router, private authService: AuthenticationService) {
    this.authService.getVerifiedLoggedIn().subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.loggedIn) {
      // logged in so return true
      return true;
    } else {

      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }
  }
}
