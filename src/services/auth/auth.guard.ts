import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';


export const authGuard: CanActivateFn = () => {
   const router = inject(Router);
 

  if (!localStorage.getItem('token')) {
    router.navigate(['login']);

    return false;
  }
  return true;

};
