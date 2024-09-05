import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing, {
  localeDetection: false,
  alternateLinks: false,
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|slice-simulator|.*\\..*).*)"],
};
