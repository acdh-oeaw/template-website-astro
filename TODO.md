- actually optimise image sizes (not only convert to webp)

- cache node_modules/.astro folder in github action
- use prebuilt playwright image in github action

- remove #444 etc. colors
- remove tailwind preset (we dont need all these color tokens)
- avoid running e2e test when only changes in content/public folders (use paths-filter action)
