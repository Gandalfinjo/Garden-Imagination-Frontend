import { CanActivateFn, Router } from '@angular/router';

export const userGuard: CanActivateFn = (route, state) => {
  if(localStorage.getItem("logged") != null) return true;
  else {
    new Router().navigate(["login"]);
    return false;
  }
};
