interface SignIn {
  email: string;
  password: string | number;
}
export interface Request {
  sign_in: (data: SignIn) => unknown;
}
