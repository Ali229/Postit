import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {User} from "../_models";
import {AuthenticationService} from "../_services";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  public static readonly ADMIN_PAGES: string[] = ['home', 'users', 'accounts', 'event-log'];
  public static readonly MANAGER_PAGES = ['home', 'accounts', 'journals', 'account/:account_id', ['financial-statements', 'income-statement', 'trial-balance']];
  public static readonly USER_PAGES = ['home', 'accounts', 'journals', 'account/:account_id', ['financial-statements', 'income-statement', 'trial-balance']];
  private readonly typePageMap;

  constructor(private router: Router,
              private authService: AuthenticationService) {
    this.typePageMap = {
      'user': AuthGuard.USER_PAGES,
      'manager': AuthGuard.MANAGER_PAGES,
      'admin': AuthGuard.ADMIN_PAGES
    };
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) {
      // logged in so return true
      if (this.inArray(this.typePageMap[this.authService.getUserType()], route.routeConfig.path)) {
        return true;
      } else {
        this.router.navigate(['/home'], {queryParams: {returnUrl: state.url}});
        return false;
      }
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }
  }

  getAvailablePages(user: User) {
    return this.typePageMap[user.user_type]
  }

  inArray(array, value) {
    for(let arrayValue of array) {
      if(Array.isArray(arrayValue)) {
        return this.inArray(arrayValue, value);
      }
      if(arrayValue === value) {
        return true;
      }
    }
    return false;
  }
}
