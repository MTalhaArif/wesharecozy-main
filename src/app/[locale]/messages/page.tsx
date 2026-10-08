import { Inbox } from "@/components/marketplace/inbox";
import { copy as c } from "@/lib/copy";
export default async function MessagesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ thread?: string }>;
}) {
  const { locale: l } = await params;
  const { thread } = await searchParams;
  return (
    <div className="site-shell section">
      <div className="page-heading">
        <p className="eyebrow green">
          {c(
            l,
            "CONNECTIONS THAT FEEL LIKE HOME",
            "EVİNİZDE HİSSETTİREN BAĞLANTILAR",
          )}
        </p>
        <h1>{c(l, "Your inbox.", "Mesaj kutunuz.")}</h1>
      </div>
      <Inbox initialThread={thread} />
    </div>
  );
}
