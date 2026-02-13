import Link from 'next/link';

export default function BankDocsPage() {
  return (
    <div className="container max-w-6xl py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Bank Partner Documentation</h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to integrate and manage Vinr as a white-label solution
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/banks/get-started"
          className="border rounded-lg p-6 hover:border-primary transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">🚀 Get Started</h2>
          <p className="text-muted-foreground">
            Partner onboarding and initial setup
          </p>
        </Link>

        <Link
          href="/banks/white-label"
          className="border rounded-lg p-6 hover:border-primary transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">🎨 White-Label</h2>
          <p className="text-muted-foreground">
            Configure branding and customization
          </p>
        </Link>

        <Link
          href="/banks/integration"
          className="border rounded-lg p-6 hover:border-primary transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">🔧 Integration</h2>
          <p className="text-muted-foreground">
            Technical integration and infrastructure
          </p>
        </Link>

        <Link
          href="/banks/api"
          className="border rounded-lg p-6 hover:border-primary transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">📚 Partner API</h2>
          <p className="text-muted-foreground">
            API documentation for partner features
          </p>
        </Link>
      </div>
    </div>
  );
}
