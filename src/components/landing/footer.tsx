import Link from "next/link";
import { Bot } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-neutral-800">
      <div className="container mx-auto py-8 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-white">Savrii</span>
        </div>
        <p className="text-sm text-neutral-400">&copy; {new Date().getFullYear()} Savrii. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
