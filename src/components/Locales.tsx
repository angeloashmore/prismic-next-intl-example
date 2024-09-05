import { PrismicDocument } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";

import { createClient, getLocales } from "@/prismicio";

type LocalesProps = {
  document: PrismicDocument;
};

export async function Locales({ document: doc }: LocalesProps) {
  const client = createClient();
  const locales = await getLocales(doc, client);

  return (
    <ul>
      {locales.map((locale) => (
        <li key={locale.id}>
          <PrismicNextLink document={locale}>
            {locale.lang_name}
          </PrismicNextLink>
        </li>
      ))}
    </ul>
  );
}
