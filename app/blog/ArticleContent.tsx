"use client";

import { useEffect, useState } from "react";

export default function ArticleContent({ html }: { html: string }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const check = () => {
      setDark(document.documentElement.classList.contains("dark"));
    };
    check();

    // Watch for class changes on <html>
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`article-content ${dark ? "article-dark" : "article-light"}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}