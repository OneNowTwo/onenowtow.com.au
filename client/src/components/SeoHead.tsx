import { useEffect } from "react";
import { useLocation } from "wouter";
import {
  applyPageMetaToDocument,
  getPageMeta,
  getRequestPath,
} from "@shared/pageMeta";

export {
  localBusinessSchema,
  SITE_URL,
  videoObjectSchema,
} from "@shared/pageMeta";

export function SeoHead() {
  const [location] = useLocation();

  useEffect(() => {
    applyPageMetaToDocument(getPageMeta(getRequestPath(location)));
  }, [location]);

  return null;
}
