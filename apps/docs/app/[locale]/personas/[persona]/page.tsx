import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { source } from "@/lib/source";
import { PersonaEnum, type Persona } from "@/lib/schema";
import logoDark from "../../assets/Full-logo_Vinr_dark.svg";

// Display copy per persona. Which docs appear is driven by the `persona`
// frontmatter on each page (see lib/schema.ts), not by this map.
const personaMeta: Record<Persona, { title: string; description: string }> = {
  developer: {
    title: "Developer",
    description:
      "API references, SDKs, integration guides, webhooks, and code examples for building on VINR.",
  },
  "finance-manager": {
    title: "Finance Manager",
    description:
      "Settlement schedules, reconciliation, fee structures, and financial reporting.",
  },
  operations: {
    title: "Operations",
    description:
      "Dashboard guides, monitoring, alerts, and day-to-day operational processes.",
  },
  "compliance-officer": {
    title: "Compliance Officer",
    description:
      "KYC/AML requirements, PCI DSS, data protection, and regulatory obligations.",
  },
  "business-owner": {
    title: "Business Owner",
    description:
      "Platform overview, pricing, getting started, and strategic integration decisions.",
  },
  partner: {
    title: "Partner",
    description:
      "Bank partner integration, co-branded solutions, and partner-specific guides.",
  },
};

// P0 documents surface before P1 before P2; ties broken alphabetically by title.
const PRIORITY_ORDER: Record<string, number> = { P0: 0, P1: 1, P2: 2 };

export default async function PersonaPage(props: {
  params: Promise<{ persona: string; locale: string }>;
}) {
  const params = await props.params;
  const parsed = PersonaEnum.safeParse(params.persona);
  if (!parsed.success) notFound();
  const persona = parsed.data;
  const data = personaMeta[persona];

  const pages = source
    .getPages(params.locale)
    .filter((page) => page.data.persona?.includes(persona))
    .sort((a, b) => {
      const byPriority =
        (PRIORITY_ORDER[a.data.priority] ?? 99) -
        (PRIORITY_ORDER[b.data.priority] ?? 99);
      return byPriority !== 0
        ? byPriority
        : a.data.title.localeCompare(b.data.title);
    });

  return (
    <main className="flex min-h-screen flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Image src={logoDark} alt="VINR" height={22} priority />
          </Link>
          <Link
            href="/docs"
            className="text-[13px] font-medium text-muted-foreground hover:text-foreground"
          >
            All documentation
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1200px] px-6 pb-8 pt-12">
          <p className="text-[13px] font-medium text-muted-foreground">
            Documentation for
          </p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-foreground">
            {data.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {data.description}
          </p>
        </div>
      </section>

      {/* Recommended pages */}
      <section className="mx-auto w-full max-w-[1200px] px-6 py-10">
        <h2 className="text-sm font-semibold text-foreground">
          Recommended reading
        </h2>
        {pages.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {pages.map((page) => (
              <Link
                key={page.url}
                href={page.url}
                className="group bg-card p-5 transition-colors hover:bg-accent"
              >
                <h3 className="text-sm font-medium text-foreground group-hover:text-vinr-700 dark:group-hover:text-vinr-300">
                  {page.data.title}
                </h3>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {page.data.description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-[13px] text-muted-foreground">
            No pages are tagged for this persona yet.
          </p>
        )}

        <div className="mt-10 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link
              href="/ask"
              className="font-medium text-vinr-700 hover:text-vinr-900 dark:text-vinr-300 dark:hover:text-vinr-200"
            >
              Ask our AI assistant
            </Link>{" "}
            or{" "}
            <Link
              href="/docs"
              className="font-medium text-vinr-700 hover:text-vinr-900 dark:text-vinr-300 dark:hover:text-vinr-200"
            >
              browse all documentation
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

export function generateStaticParams() {
  return Object.keys(personaMeta).map((persona) => ({ persona }));
}
