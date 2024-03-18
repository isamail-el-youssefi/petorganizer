import { auth } from "./lib/auth";

export default auth;

console.log("hi i am middleware");

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
