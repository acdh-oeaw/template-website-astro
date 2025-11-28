import { makeHandler } from "@keystatic/astro/api";

import { config } from "@/lib/content/keystatic/config";

export const prerender = false;

const ALL = makeHandler({ config });

export { ALL };
