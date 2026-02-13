import Link from 'next/link';

export default function BankApiIndexPage() {
  return (
    <div className="container max-w-6xl py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Bank Partner API Reference</h1>
        <p className="text-xl text-muted-foreground">
          API documentation for managing your white-label payment platform
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Partner Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/banks/api/authentication"
              className="border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-1">Partner Authentication</h3>
              <p className="text-sm text-muted-foreground">
                API keys and partner authentication
              </p>
            </Link>
            <Link
              href="/banks/api/merchants"
              className="border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-1">Merchant Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage your merchants and their settings
              </p>
            </Link>
            <Link
              href="/banks/api/white-label"
              className="border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-1">White-Label Config</h3>
              <p className="text-sm text-muted-foreground">
                Configure branding and customization
              </p>
            </Link>
            <Link
              href="/banks/api/reporting"
              className="border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-1">Reporting</h3>
              <p className="text-sm text-muted-foreground">
                Access aggregated reporting data
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
