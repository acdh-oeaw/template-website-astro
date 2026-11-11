import { config } from "@/lib/content/keystatic/config";

/**
 * Keystatic routes (admin ui and api) are only served in the dev server, unless github mode is
 * configured. In local mode the keystatic api has no authentication and writes directly to the
 * server's file system, so it must never be reachable in production builds.
 */
export const isKeystaticEnabled = import.meta.env.DEV || config.storage.kind === "github";
