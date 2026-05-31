import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-5xl font-bold text-fd-muted-foreground/30">404</div>
      <h2 className="mt-4 text-lg font-semibold text-fd-foreground">
        Page not found
      </h2>
      <p className="mt-2 max-w-sm text-center text-sm text-fd-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/docs"
          className="rounded-lg bg-vinr-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-vinr-800"
        >
          Go to Docs
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-fd-border px-4 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
