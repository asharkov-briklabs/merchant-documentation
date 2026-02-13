import Link from 'next/link';

export default function ApiIndexPage() {
  return (
    <div className="container max-w-6xl py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Vinr API Reference</h1>
        <p className="text-xl text-muted-foreground">
          Complete API documentation for integrating Vinr's payment platform
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Core Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/api/authentication"
              className="border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-1">Authentication</h3>
              <p className="text-sm text-muted-foreground">
                API keys and authentication methods
              </p>
            </Link>
            <Link
              href="/api/payments"
              className="border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-1">Payments</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage payments
              </p>
            </Link>
            <Link
              href="/api/customers"
              className="border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-1">Customers</h3>
              <p className="text-sm text-muted-foreground">
                Manage customer information
              </p>
            </Link>
            <Link
              href="/api/webhooks"
              className="border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-1">Webhooks</h3>
              <p className="text-sm text-muted-foreground">
                Configure webhook endpoints
              </p>
            </Link>
          </div>
        </section>

        <section className="border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="text-muted-foreground mb-4">
            New to the Vinr API? Check out our integration guides:
          </p>
          <div className="flex gap-4">
            <Link
              href="/merchant/get-started/quick-start"
              className="text-primary hover:underline"
            >
              Quick Start Guide →
            </Link>
            <Link
              href="/merchant/developer/webhooks"
              className="text-primary hover:underline"
            >
              Webhook Setup →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
