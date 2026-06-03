"use client";

import { API_LANGUAGES, useApiRef, type ApiSample, type LangId } from "./api-ref-context";
import { CopyButton } from "./copy-button";

// Keep in sync with `servers[0].url` in openapi.yaml — both must change together.
export const API_BASE_URL = "https://api.vinr.com";

/** Auth bootstrap shown in the default rail when a page has no <ApiExample>. */
const AUTH_SNIPPETS: Record<LangId, string> = {
  curl: `curl ${API_BASE_URL}/v1/payments \\
  -H "X-Api-Key: $VINR_SECRET_KEY"`,
  node: `import { Vinr } from '@vinr/sdk';

const vinr = new Vinr({ secretKey: process.env.VINR_SECRET_KEY });`,
  python: `import vinr

vinr.api_key = os.environ["VINR_SECRET_KEY"]`,
  ruby: `require 'vinr'

Vinr.api_key = ENV['VINR_SECRET_KEY']`,
  go: `import "github.com/vinr/vinr-go"

client := vinr.NewClient(os.Getenv("VINR_SECRET_KEY"))`,
  php: `\\Vinr\\Vinr::setApiKey(getenv('VINR_SECRET_KEY'));`,
};

const INSTALL: Record<LangId, string> = {
  curl: "# No SDK required — call the REST API directly.",
  node: "npm install @vinr/sdk",
  python: "pip install vinr",
  ruby: "gem install vinr",
  go: "go get github.com/vinr/vinr-go",
  php: "composer require vinr/vinr-php",
};

/** Resolve the request snippet for the active language, falling back sensibly. */
function pickRequest(req: ApiSample["request"], lang: LangId): { lang: LangId; code: string } | null {
  if (req[lang]) return { lang, code: req[lang]! };
  for (const l of API_LANGUAGES) if (req[l.id]) return { lang: l.id, code: req[l.id]! };
  return null;
}

/** Sticky right-hand code panel (Stripe-style). Shows the active endpoint's
 *  request/response, or an auth/install primer when the page has no examples. */
export function ApiCodeRail() {
  const { samples, activeId, lang } = useApiRef();
  const active = samples.find((s) => s.id === activeId) ?? samples[0] ?? null;

  return (
    <div className="sticky top-14 flex max-h-[calc(100dvh-3.5rem)] flex-col gap-3 overflow-y-auto py-6 pr-4 md:pr-6">
      <BaseUrlCard />
      {active ? <ExamplePanel sample={active} lang={lang} /> : <DefaultPanel lang={lang} />}
    </div>
  );
}

function BaseUrlCard() {
  return (
    <CodeCard label="Base URL">
      <CodeBlock code={API_BASE_URL} />
    </CodeCard>
  );
}

function ExamplePanel({ sample, lang }: { sample: ApiSample; lang: LangId }) {
  const req = pickRequest(sample.request, lang);
  return (
    <>
      <CodeCard
        label={
          sample.method || sample.path
            ? `${sample.method ?? ""} ${sample.path ?? ""}`.trim()
            : "Request"
        }
        accent
        copyValue={req?.code}
      >
        {req ? (
          <CodeBlock code={req.code} />
        ) : (
          <p className="px-3.5 py-3 text-[12.5px] text-vinr-50/45">No example for this language.</p>
        )}
      </CodeCard>
      {sample.response && (
        <CodeCard label="Response" copyValue={sample.response}>
          <CodeBlock code={sample.response} />
        </CodeCard>
      )}
    </>
  );
}

function DefaultPanel({ lang }: { lang: LangId }) {
  return (
    <>
      <CodeCard label="Authentication" copyValue={AUTH_SNIPPETS[lang]}>
        <CodeBlock code={AUTH_SNIPPETS[lang]} />
      </CodeCard>
      <CodeCard label="Install" copyValue={INSTALL[lang]}>
        <CodeBlock code={INSTALL[lang]} />
      </CodeCard>
    </>
  );
}

function CodeCard({
  label,
  children,
  accent,
  copyValue,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
  copyValue?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-vinr-800/70">
      <div
        className={[
          "flex h-9 items-center justify-between border-b border-white/[0.06] pl-3.5 pr-1.5",
          accent ? "bg-vinr-500/[0.12]" : "bg-white/[0.02]",
        ].join(" ")}
      >
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.04em] text-vinr-50/55">
          {label}
        </span>
        {copyValue && <CopyButton value={copyValue} />}
      </div>
      {children}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto px-3.5 py-3 text-[12.5px] leading-[1.6] text-vinr-50/85">
      <code className="font-mono">{code}</code>
    </pre>
  );
}
