import { HttpErrorResponse } from '@angular/common/http';

const DEFAULT = 'Erreur inconnue';


export function getHttpErrorMessage(err: unknown): string {
  if (!err) return DEFAULT;

  if (err instanceof HttpErrorResponse) {
    const body = err.error;
    if (body && typeof body === 'object' && 'message' in body) {
      const m = (body as { message?: string }).message;
      if (typeof m === 'string' && m.trim()) return m.trim();
    }
    if (typeof body === 'string' && body.trim()) return body.trim();
  }

  const msg = (err as Error)?.message;
  return typeof msg === 'string' && msg.trim() ? msg.trim() : DEFAULT;
}
