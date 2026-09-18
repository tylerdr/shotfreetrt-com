import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <p>
        Return to the <Link href="/blog">blog index</Link>.
      </p>
    </div>
  );
}
