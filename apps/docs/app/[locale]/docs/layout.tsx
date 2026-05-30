import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layout";
import { RootToggle } from "fumadocs-ui/components/layout/root-toggle";
import type { ReactNode } from "react";
import {
  Rocket,
  BookOpen,
  CreditCard,
  ReceiptText,
  Gift,
  Blocks,
  Activity,
  ShieldCheck,
  Code,
  LifeBuoy,
  History,
} from "lucide-react";
import { VinrWordmark } from "../components/vinr-wordmark";
import { getTranslations } from "@/lib/translations";
import { localeHref } from "@/lib/locale-href";

// Product switcher (Stripe-style): each entry is a root folder in
// content/docs (meta.json `"root": true`). The sidebar auto-scopes to the
// active root; this toggle lets users jump between them.
const ROOTS: {
  path: string;
  title: string;
  description: string;
  icon: ReactNode;
}[] = [
  { path: "/docs/getting-started", title: "Get started", description: "Set up and make your first call", icon: <Rocket /> },
  { path: "/docs/guides", title: "Guides", description: "End-to-end recipes by product", icon: <BookOpen /> },
  { path: "/docs/payments", title: "Payments", description: "Accept and process payments", icon: <CreditCard /> },
  { path: "/docs/billing", title: "Billing", description: "Subscriptions, invoicing, usage", icon: <ReceiptText /> },
  { path: "/docs/engagement", title: "Engagement", description: "Loyalty, rewards, campaigns", icon: <Gift /> },
  { path: "/docs/integration", title: "Integration", description: "Checkout, Elements, webhooks", icon: <Blocks /> },
  { path: "/docs/operations", title: "Operations", description: "Settlement, payouts, reporting", icon: <Activity /> },
  { path: "/docs/compliance", title: "Compliance", description: "PCI, KYC/AML, PSD2, GDPR", icon: <ShieldCheck /> },
  { path: "/docs/api-reference", title: "API reference", description: "Endpoints, objects, errors", icon: <Code /> },
  { path: "/docs/troubleshooting", title: "Troubleshooting", description: "Errors, declines, debugging", icon: <LifeBuoy /> },
  { path: "/docs/changelog", title: "Changelog", description: "API and product changes", icon: <History /> },
];

export default function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const t = getTranslations(params.locale);

  return (
    <DocsLayout
      tree={source.pageTree[params.locale]}
      nav={{
        title: <VinrWordmark height={18} fill="#0b3b45" />,
        url: localeHref(params.locale, "/"),
      }}
      sidebar={{
        banner: (
          <RootToggle
            options={ROOTS.map((r) => ({
              url: localeHref(params.locale, r.path),
              title: r.title,
              description: r.description,
              icon: r.icon,
            }))}
          />
        ),
      }}
      links={[
        { text: t.docs, url: localeHref(params.locale, "/docs"), type: "main" },
        { text: t.api, url: localeHref(params.locale, "/docs/api-reference"), type: "main" },
        { text: t.askAi, url: localeHref(params.locale, "/ask"), type: "button" },
      ]}
      i18n
    >
      {children}
    </DocsLayout>
  );
}
