import http from "./config";
import { Request } from "@auth-type";
const auth: Request = {
  sign_in: (data) => http.post("/auth/login", data),
};
export default auth;
