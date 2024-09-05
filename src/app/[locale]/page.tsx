import { Metadata } from "next";

import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { shortLocaleToLong, longLocaleToShort } from "@/i18n/routing";
import { Locales } from "@/components/Locales";

type Params = { locale: string };

export default async function Index({ params }: { params: Params }) {
  const client = createClient();
  const home = await client.getSingle("homepage", {
    lang: shortLocaleToLong(params.locale),
  });

  return (
    <>
      <Locales document={home} />
      <SliceZone slices={home.data.slices} components={components} />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();
  const home = await client.getSingle("homepage", {
    lang: shortLocaleToLong(params.locale),
  });

  return {
    title: asText(home.data.title),
    description: home.data.meta_description,
    openGraph: {
      title: home.data.meta_title ?? undefined,
      images: [{ url: home.data.meta_image.url ?? "" }],
    },
  };
}

export async function generateStaticParams(): Promise<Params[]> {
  const client = createClient();
  const pages = await client.getAllByType("homepage", { lang: "*" });

  return pages.map((page) => ({
    locale: longLocaleToShort(page.lang),
  }));
}
