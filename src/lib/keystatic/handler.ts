import { makeHandler } from "@keystatic/astro/api";

import config from "~/keystatic.config";

export const ALL = makeHandler({ config });
