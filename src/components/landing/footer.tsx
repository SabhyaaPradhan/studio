import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-8 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Savrii</span>
        </div>
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Savrii. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
