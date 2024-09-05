import { Metadata } from "next";

import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { reverseLocaleLookup } from "@/i18n";
import { Locales } from "@/components/Locales";

type Params = { lang: string; uid: string };

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client.getByUID("page", params.uid, {
    lang: reverseLocaleLookup(params.lang),
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
    lang: reverseLocaleLookup(params.lang),
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

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("page", { lang: "*" });

  return pages.map((page) => ({
    lang: page.lang,
    uid: page.uid,
  }));
}
