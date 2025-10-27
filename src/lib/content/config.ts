import { createConfig } from "@acdh-oeaw/content-lib";

import { pages } from "@/lib/content/collections/pages";
import { indexPage } from "@/lib/content/singletons/index-page";
import { navigation } from "@/lib/content/singletons/navigation";

export const config = createConfig({
	collections: [pages.de, pages.en, indexPage.de, indexPage.en, navigation.de, navigation.en],
});
