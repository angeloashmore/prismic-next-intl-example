import { createLocaleRedirect, pathnameHasLocale } from "@/i18n";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (!pathnameHasLocale(request)) {
    return createLocaleRedirect(request);
  }
}

export const config = {
  matcher: ["/((?!_next|api|slice-simulator|icon.svg).*)"],
};
