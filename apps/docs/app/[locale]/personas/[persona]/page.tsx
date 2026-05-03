import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import logoDark from "../../assets/Full-logo_Vinr_dark.svg";

const personaData: Record<
  string,
  { title: string; description: string; categories: { slug: string; label: string }[] }
> = {
  developer: {
    title: "Developer",
    description:
      "API references, SDKs, integration guides, webhooks, and code examples for building on VINR.",
    categories: [
      { slug: "getting-started", label: "Getting Started" },
      { slug: "integration", label: "Integration" },
      { slug: "api-reference", label: "API Reference" },
      { slug: "troubleshooting", label: "Troubleshooting" },
    ],
  },
  "finance-manager": {
    title: "Finance Manager",
    description:
      "Settlement schedules, reconciliation, fee structures, and financial reporting.",
    categories: [
      { slug: "payments", label: "Payments" },
      { slug: "operations", label: "Operations" },
      { slug: "compliance", label: "Compliance" },
    ],
  },
  operations: {
    title: "Operations",
    description:
      "Dashboard guides, monitoring, alerts, and day-to-day operational processes.",
    categories: [
      { slug: "operations", label: "Operations" },
      { slug: "payments", label: "Payments" },
      { slug: "troubleshooting", label: "Troubleshooting" },
    ],
  },
  "compliance-officer": {
    title: "Compliance Officer",
    description:
      "KYC/AML requirements, PCI DSS, data protection, and regulatory obligations.",
    categories: [
      { slug: "compliance", label: "Compliance" },
      { slug: "operations", label: "Operations" },
    ],
  },
  "business-owner": {
    title: "Business Owner",
    description:
      "Platform overview, pricing, getting started, and strategic integration decisions.",
    categories: [
      { slug: "getting-started", label: "Getting Started" },
      { slug: "payments", label: "Payments" },
      { slug: "operations", label: "Operations" },
    ],
  },
  partner: {
    title: "Partner",
    description:
      "Bank partner integration, co-branded solutions, and partner-specific guides.",
    categories: [
      { slug: "integration", label: "Integration" },
      { slug: "compliance", label: "Compliance" },
      { slug: "api-reference", label: "API Reference" },
    ],
  },
};

export default async function PersonaPage(props: {
  params: Promise<{ persona: string }>;
}) {
  const params = await props.params;
  const data = personaData[params.persona];
  if (!data) notFound();

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

      {/* Recommended topics */}
      <section className="mx-auto w-full max-w-[1200px] px-6 py-10">
        <h2 className="text-sm font-semibold text-foreground">
          Recommended topics
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {data.categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/docs/${cat.slug}`}
              className="group bg-card p-5 transition-colors hover:bg-accent"
            >
              <h3 className="text-sm font-medium text-foreground group-hover:text-vinr-700 dark:group-hover:text-vinr-300">
                {cat.label}
              </h3>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Browse {cat.label.toLowerCase()} documentation
              </p>
            </Link>
          ))}
        </div>

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
  return Object.keys(personaData).map((persona) => ({ persona }));
}
