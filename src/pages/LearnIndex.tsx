import { Link } from "@tanstack/react-router";
import { LEARN_SLUGS, learnFaq, learnPage } from "@/content/learn";
import { Disclaimer } from "@/components/Disclaimer";
import { GuideNav } from "@/components/GuideNav";
import { useLang } from "@/lib/i18n";
import type { BasePath } from "@/lib/site";

export function LearnIndex() {
  const { c, locale, path } = useLang();
  const faq = learnFaq(locale);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-20">
      <header>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {c.learn.eyebrow}
        </p>
        <div className="mt-3 h-1 w-16 rounded-full bg-ribbon" />
        <h1 className="mt-5 max-w-3xl text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-[1.05] tracking-tight">
          {c.learn.titleA} <span className="accent font-normal">{c.learn.titleAccent}</span>
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {c.learn.lede}
        </p>
        <GuideNav current="/learn" />
      </header>

      <div className="mt-10 max-w-3xl">
        <Disclaimer title={c.learn.notAdviceTitle} body={c.learn.notAdviceBody} />
      </div>

      <ul className="mt-14 grid gap-10 sm:grid-cols-2">
        {LEARN_SLUGS.map((slug) => {
          const page = learnPage(locale, slug);
          const to = `/learn/${slug}` as BasePath;
          return (
            <li key={slug} className="border-t border-foreground/15 pt-5">
              <h2 className="text-xl font-semibold tracking-tight">
                <Link to={path(to)} className="hover:underline">
                  {page.title}
                </Link>
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{page.lede}</p>
              <Link to={path(to)} className="mt-4 inline-flex text-sm font-medium">
                <span className="marker">{c.learn.readGuide}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="below-fold mt-20 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
          {c.learn.faqTitle}
        </h2>
        <dl className="mt-6 divide-y divide-hairline border-t border-hairline">
          {faq.map((item) => (
            <div key={item.question} className="py-6">
              <dt className="text-[17px] font-medium tracking-tight">{item.question}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {item.answer}
              </dd>
              <dd className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {item.citations.map((citation) => (
                  <a
                    key={citation.href}
                    href={citation.href}
                    className="text-xs text-muted-foreground underline decoration-hairline underline-offset-4"
                  >
                    {citation.label}
                  </a>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
