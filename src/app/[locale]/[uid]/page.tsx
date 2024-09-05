import { Metadata } from "next";

import { unstable_setRequestLocale } from "next-intl/server";
import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { shortLocaleToLong, longLocaleToShort } from "@/i18n/routing";
import { Locales } from "@/components/Locales";

type Params = { locale: string; uid: string };

export default async function Page({ params }: { params: Params }) {
  unstable_setRequestLocale(params.locale);

  const client = createClient();
  const page = await client.getByUID("page", params.uid, {
    lang: shortLocaleToLong(params.locale),
  });

  return (
    <>
      <Locales document={page} />
      <SliceZone slices={page.data.slices} components={components} />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();
  const page = await client.getByUID("page", params.uid, {
    lang: shortLocaleToLong(params.locale),
  });

  return {
    title: asText(page.data.title),
    description: page.data.meta_description,
    openGraph: {
      title: page.data.meta_title || undefined,
      images: [{ url: page.data.meta_image.url ?? "" }],
    },
  };
}

export async function generateStaticParams(): Promise<Params[]> {
  const client = createClient();
  const pages = await client.getAllByType("page", { lang: "*" });

  return pages.map((page) => ({
    locale: longLocaleToShort(page.lang),
    uid: page.uid,
  }));
}
