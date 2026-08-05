import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

/** Preferred SEO destinations — older / duplicate paths 301 here. */
const SEO_REDIRECTS: Record<string, string> = {
  // Industrial / warehouse — consolidate to preferred URL
  "/industrial-warehouse-video-sydney": "/industrial-warehouse-property-video",
  "/industrial-video-production-sydney": "/industrial-warehouse-property-video",
  "/warehouse-video-production-sydney": "/industrial-warehouse-property-video",
  "/industrial-warehouse-video": "/industrial-warehouse-property-video",
  "/warehouse-property-video": "/industrial-warehouse-property-video",
  "/industrial-property-video": "/industrial-warehouse-property-video",
};

export async function registerRoutes(app: Express): Promise<Server> {
  // 301 redirects must run before the SPA catch-all so Google gets a real redirect
  app.use((req, res, next) => {
    const path = req.path.replace(/\/$/, "") || "/";
    const target = SEO_REDIRECTS[path];
    if (target) {
      const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
      return res.redirect(301, `${target}${query}`);
    }
    next();
  });

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
