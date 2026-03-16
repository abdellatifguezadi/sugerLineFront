import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });

  return next(authReq);
};
