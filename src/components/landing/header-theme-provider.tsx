
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function HeaderThemeProvider({ children }: { children: React.ReactNode }) {
  const {setTheme} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
        setTheme(theme);
    }
    setMounted(true);
  }, [setTheme]);

  if (!mounted) {
    // Return a placeholder or null to avoid rendering content on the server
    // that might depend on the theme, preventing hydration mismatches.
    return null; 
  }

  return <>{children}</>;
}
