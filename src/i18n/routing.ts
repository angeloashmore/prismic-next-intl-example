import { defineRouting } from "next-intl/routing";
import { createSharedPathnamesNavigation } from "next-intl/navigation";

/**
 * A record of locales mapped to a version displayed in URLs.
 */
export const LOCALES: Record<string, string> = {
  "en-us": "en",
  "fr-fr": "fr",
};

/**
 * Returns the short locale of a given long locale. It returns `undefined` if
 * the locale is not in the master list.
 */
export function longLocaleToShort(locale: string) {
  return LOCALES[locale];
}

/**
 * Returns the full locale of a given short locale. It returns `undefined` if
 * the locale is not in the master list.
 */
export function shortLocaleToLong(locale: string): string | undefined {
  for (const key in LOCALES) {
    if (LOCALES[key] === locale) return key;
  }
}

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: Object.values(LOCALES),

  // Used when no locale matches
  defaultLocale: Object.values(LOCALES)[0],

  // Don't use a locale prefix for the default locale
  localePrefix: "as-needed",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation(routing);
