import Link from "next/link";
import packageJson from "../../package.json";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/50 px-4 py-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted">
          &copy; {year} <span className="font-semibold">Selah Study</span>. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted">
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms of Use
          </Link>
          <span className="text-border">|</span>
          <span className="text-xs">v{packageJson.version}</span>
        </div>
      </div>
    </footer>
  );
}
