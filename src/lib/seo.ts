import { learnFaq, learnPage, LEARN_REVIEWED, type LearnSlug } from "@/content/learn";
import type { Locale } from "@/content/copy";
import { absoluteUrl, localizedPath, SITE_ORIGIN, type AppPath, type BasePath } from "@/lib/site";

type Head = {
  meta: Record<string, string>[];
  links: Record<string, string>[];
  scripts?: { type: string; children: string }[];
};

function alternates(path: BasePath): Record<string, string>[] {
  const en = absoluteUrl(localizedPath(path, "en"));
  const da = absoluteUrl(localizedPath(path, "da"));
  return [
    { rel: "alternate", hrefLang: "en", href: en },
    { rel: "alternate", hrefLang: "da", href: da },
    { rel: "alternate", hrefLang: "x-default", href: en },
  ];
}

export function pageHead(options: {
  locale: Locale;
  path: BasePath;
  title: string;
  description: string;
  jsonLd?: Record<string, unknown>[];
}): Head {
  const url = absoluteUrl(localizedPath(options.path, options.locale));
  return {
    meta: [
      { title: options.title },
      { name: "description", content: options.description },
      { property: "og:title", content: options.title },
      { property: "og:description", content: options.description },
      { property: "og:url", content: url },
      { property: "og:locale", content: options.locale === "da" ? "da_DK" : "en_GB" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: url }, ...alternates(options.path)],
    scripts: options.jsonLd?.map((entry) => ({
      type: "application/ld+json",
      children: JSON.stringify(entry),
    })),
  };
}

export function learnIndexHead(locale: Locale): Head {
  const title =
    locale === "da"
      ? "Endometriose forklaret — symptomer, diagnose, behandling — OpenEndo"
      : "Endometriosis explained — symptoms, diagnosis, treatment — OpenEndo";
  const description =
    locale === "da"
      ? "Patientvendte forklaringer med kildehenvisning til WHO og NICE. Ikke lægefaglig rådgivning. Dansk forløb fra åbne data."
      : "Patient-facing explainers cited to WHO and NICE. Not medical advice. Denmark's care pathway comes from open data.";
  const faq = learnFaq(locale);
  return pageHead({
    locale,
    path: "/learn",
    title,
    description,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        url: absoluteUrl(localizedPath("/learn", locale)),
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  });
}

export function learnArticleHead(locale: Locale, slug: LearnSlug): Head {
  const page = learnPage(locale, slug);
  const path = `/learn/${slug}` as BasePath;
  const url = absoluteUrl(localizedPath(path, locale));
  const citations = [
    ...new Set(
      page.sections.flatMap((section) => section.citations.map((citation) => citation.href)),
    ),
  ];
  return pageHead({
    locale,
    path,
    title: `${page.title} — OpenEndo`,
    description: page.description,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: page.title,
        url,
        description: page.description,
        lastReviewed: LEARN_REVIEWED,
        inLanguage: locale,
        audience: { "@type": "Patient" },
        about: { "@type": "MedicalCondition", name: "Endometriosis" },
        citation: citations,
        isPartOf: { "@type": "WebSite", name: "OpenEndo", url: SITE_ORIGIN },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "OpenEndo", item: `${SITE_ORIGIN}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: locale === "da" ? "Viden for patienter" : "Guides",
            item: absoluteUrl(localizedPath("/learn", locale)),
          },
          { "@type": "ListItem", position: 3, name: page.title, item: url },
        ],
      },
    ],
  });
}

export function sourcesHead(locale: Locale): Head {
  return pageHead({
    locale,
    path: "/sources",
    title: locale === "da" ? "Kilder og metode — OpenEndo" : "Sources and method — OpenEndo",
    description:
      locale === "da"
        ? "Hvordan OpenEndo tjekker guider mod WHO og NICE, og hvordan forsøg, studier og bevillinger hentes fra det åbne datasæt."
        : "How OpenEndo checks guides against WHO and NICE, and how trials, papers, and funding are read from the open dataset.",
  });
}

export function findHead(locale: Locale): Head {
  return pageHead({
    locale,
    path: "/find",
    title: locale === "da" ? "Indeks — OpenEndo" : "Index — OpenEndo",
    description:
      locale === "da"
        ? "Indeks over OpenEndos sider om endometriose, diagnose, behandling, Danmark, forskning og data."
        : "Index of OpenEndo pages on endometriosis, diagnosis, treatment, Denmark, research, and data.",
  });
}

export function evidenceHead(locale: Locale): Head {
  return pageHead({
    locale,
    path: "/evidence",
    title:
      locale === "da" ? "Ugentlig evidensdigest — OpenEndo" : "Weekly evidence digest — OpenEndo",
    description:
      locale === "da"
        ? "Den seneste ugentlige gennemgang af ny endometriose-litteratur, med PMID, hentet fra det åbne OpenEndo-repositorium."
        : "The latest weekly review of new endometriosis literature, with PMIDs, fetched from the open OpenEndo repository.",
  });
}

export function breadcrumbJsonLd(items: { name: string; path: AppPath }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
