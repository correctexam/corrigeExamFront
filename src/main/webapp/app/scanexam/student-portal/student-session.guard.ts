import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { StudentSessionService } from './student-session.service';

/** Pages of the portal that need a session: without one (or once expired), back to the request form. */
export const studentSessionGuard: CanActivateFn = () => {
  const session = inject(StudentSessionService);
  if (session.isActive()) {
    return true;
  }
  const expired = session.session() !== undefined;
  session.close();
  return inject(Router).createUrlTree(['/my'], expired ? { queryParams: { expired: true } } : {});
};
