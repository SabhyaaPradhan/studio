"use client";

import { useState, useEffect } from "react";

export function HeaderThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder or null to avoid rendering content on the server
    // that might depend on the theme, preventing hydration mismatches.
    return null; 
  }

  return <>{children}</>;
}
