"use client";

import { useEffect, useState } from "react";
import type { Catalog } from "@/lib/types";

export function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);

  useEffect(() => {
    void fetch("/api/catalog")
      .then((response) => response.json())
      .then((data: Catalog) => setCatalog(data))
      .catch(() => setCatalog(null));
  }, []);

  return catalog;
}
