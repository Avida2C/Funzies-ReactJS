import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
/**
 * Renders admin-editable HTML for information pages. Internal links to same-origin paths use client-side nav.
 */
export default function InformationHtmlBlock({ html, className = "" }) {
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return undefined;
    }
    const onClick = (event) => {
      const a = event.target.closest("a[href^='/']");
      if (!a) {
        return;
      }
      if (a.target === "_blank" || a.hasAttribute("download")) {
        return;
      }
      event.preventDefault();
      navigate(a.getAttribute("href") || "/");
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [navigate]);

  if (!html || !String(html).trim()) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`information-html text-base text-base-content/80 ${className}`.trim()}
      style={{ lineHeight: 1.4 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
