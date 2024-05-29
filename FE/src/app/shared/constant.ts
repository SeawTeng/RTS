import { environment } from '../../environments/environment';

export const SERVER_URL = environment.apiUrl;
export const SECRET = 'rts-2024';
export const TOKEN_SECRET = 'rts-token';

export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
