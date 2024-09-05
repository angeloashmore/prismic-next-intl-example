import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { NextRequest } from "next/server";

/**
 * A record of locales mapped to a version displayed in URLs. The first entry is
 * used as the default locale.
 */
const LOCALES: Record<string, string> = {
  "en-us": "en",
  "fr-fr": "fr",
};

/**
 * Creates a redirect with an auto-detected locale prepended to the URL.
 */
export function createLocaleRedirect(request: NextRequest): Response {
  const acceptLanguage = request.headers.get("accept-language");
  const headers = acceptLanguage ? { "accept-language": acceptLanguage } : {};
  const languages = new Negotiator({ headers }).languages();
  const locales = Object.keys(LOCALES);
  const locale = match(languages, locales, locales[0]);

  request.nextUrl.pathname = `/${LOCALES[locale]}${request.nextUrl.pathname}`;

  return Response.redirect(request.nextUrl);
}

const pathnameRegExp = new RegExp(
  `^/(${Object.values(LOCALES).join("|")})(\/|$)`,
);

/**
 * Determines if a pathname has a locale as its first segment.
 */
export function pathnameHasLocale(request: NextRequest): boolean {
  return pathnameRegExp.test(request.nextUrl.pathname);
}

/**
 * Returns the full locale of a given locale. It returns `undefined` if the
 * locale is not in the master list.
 */
export function reverseLocaleLookup(locale: string): string | undefined {
  for (const key in LOCALES) {
    if (LOCALES[key] === locale) return key;
  }
}
