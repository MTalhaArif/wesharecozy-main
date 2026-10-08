import { notFound } from "next/navigation";
import { HELP_ARTICLES } from "@/lib/ai/help-articles";
import { Link } from "@/i18n/navigation";
import { copy as c } from "@/lib/copy";
export default async function HelpTopic({
  params,
}: {
  params: Promise<{ locale: string; topic: string }>;
}) {
  const { locale: l, topic } = await params;
  const article =
    HELP_ARTICLES[topic as keyof typeof HELP_ARTICLES]?.[
      l === "tr" ? "tr" : "en"
    ];
  if (!article) notFound();
  return (
    <div className="site-shell section">
      <div className="content-width">
        <Link href="/help" className="text-link">
          ← {c(l, "All help topics", "Tüm yardım konuları")}
        </Link>
        <div className="page-heading">
          <h1>{article.title}</h1>
        </div>
        <section className="prose-section">
          <p>{article.body}</p>
        </section>
      </div>
    </div>
  );
}
