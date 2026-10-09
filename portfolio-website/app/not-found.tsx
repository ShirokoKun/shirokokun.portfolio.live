import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col justify-between p-4 sm:p-6 md:p-10">
      <span className="label text-muted">Error 404 · Frame not found</span>
      <div>
        <h1 className="display text-mega">
          Lost in
          <br />
          <span className="text-accent">the edit.</span>
        </h1>
        <p className="mt-6 max-w-[40ch] text-xl">
          This page was cut from the final version. The rest of the timeline is still here.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="label inline-flex h-12 items-center rounded-full bg-fg px-6 text-bg hover:bg-accent hover:text-accent-ink"
        >
          Back to start
        </Link>
        <Link
          href="/work"
          className="label inline-flex h-12 items-center rounded-full border border-line/25 px-6 hover:border-fg"
        >
          Browse the archive
        </Link>
      </div>
    </main>
  );
}
