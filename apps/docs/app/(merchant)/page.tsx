import Link from 'next/link';

export default function MerchantDocsPage() {
  return (
    <div className="container max-w-6xl py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Vinr Documentation</h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to integrate and use Vinr's payment platform
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/merchant/get-started"
          className="border rounded-lg p-6 hover:border-primary transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">🚀 Get Started</h2>
          <p className="text-muted-foreground">
            Quick start guide and account setup
          </p>
        </Link>

        <Link
          href="/merchant/payments"
          className="border rounded-lg p-6 hover:border-primary transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">💳 Payments</h2>
          <p className="text-muted-foreground">
            Accept and manage payments with Vinr
          </p>
        </Link>

        <Link
          href="/api"
          className="border rounded-lg p-6 hover:border-primary transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">📚 API Reference</h2>
          <p className="text-muted-foreground">
            Complete API documentation and examples
          </p>
        </Link>

        <Link
          href="/merchant/integrations"
          className="border rounded-lg p-6 hover:border-primary transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">🔌 Integrations</h2>
          <p className="text-muted-foreground">
            Connect Vinr with your existing tools
          </p>
        </Link>
      </div>
    </div>
  );
}
