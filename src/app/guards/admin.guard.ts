import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  if(localStorage.getItem("loggedAdmin") != null) return true;
  else {
    new Router().navigate(["admin-login"]);
    return false;
  }
};
