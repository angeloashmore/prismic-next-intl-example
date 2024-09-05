import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import sm from "../slicemachine.config.json";

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * The project's Prismic Route Resolvers. This list determines a Prismic document's URL.
 */
const routes: prismic.ClientConfig["routes"] = [
  { type: "homepage", lang: "en-us", path: "/" },
  { type: "homepage", lang: "fr-fr", path: "/fr" },

  { type: "page", lang: "en-us", path: "/:uid" },
  { type: "page", lang: "fr-fr", path: "/fr/:uid" },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: prismicNext.CreateClientConfig = {}) => {
  const client = prismic.createClient(sm.apiEndpoint || repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  prismicNext.enableAutoPreviews({ client });

  return client;
};

/**
 * Returns an array of document metadata containing each locale a document has
 * been translated into.
 *
 * A `lang_name` property is included in each document containing the document's
 * locale name as it is configured in the Prismic repository.
 */
export async function getLocales(
  doc: prismic.PrismicDocument,
  client: prismic.Client,
): Promise<(prismic.PrismicDocument & { lang_name?: string })[]> {
  const repository = await client.getRepository();

  const altDocs =
    doc.alternate_languages.length > 0
      ? await client.getAllByIDs(
          doc.alternate_languages.map((altLang) => altLang.id),
          {
            lang: "*",
            // Exclude all fields to speed up the query.
            fetch: `${doc.type}.__nonexistent-field__`,
          },
        )
      : [];

  return [doc, ...altDocs].map((doc) => {
    return {
      ...doc,
      lang_name: repository.languages.find((lang) => lang.id === doc.lang)
        ?.name,
    };
  });
}
