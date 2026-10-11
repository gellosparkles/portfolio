import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <p className="font-mono text-xs text-accent">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <Link href="/" className="mt-6 inline-block text-accent">
        ← Back home
      </Link>
    </div>
  );
}
