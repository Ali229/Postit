import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {User} from "../_models";
import {AuthenticationService, UserService} from "../_services";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  public static readonly ADMIN_PAGES: string[] = ['home', 'users', 'accounts', 'event-log'];
  public static readonly MANAGER_PAGES: string[] = ['home', 'accounts', 'journal'];
  public static readonly USER_PAGES: string[] = ['home', 'accounts', 'journal'];
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
    if (this.authService.getLoggedIn()) {
      console.log("User is logged in");
      // logged in so return true
      if(this.typePageMap[this.authService.getUserType()].includes(route.routeConfig.path)) {
        return true;
      } else {
        this.router.navigate(['/home'], {queryParams: {returnUrl: state.url}});
        return false;
      }
    } else {
      // not logged in so redirect to login page with the return url
      console.log("User is not logged in");
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }
  }

  getAvailablePages(user: User) {
    return this.typePageMap[user.user_type]
  }
}
