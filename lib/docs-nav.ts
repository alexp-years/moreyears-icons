export type DocNavItem = {
  title: string;
  href: string;
  description: string;
};

export const docsNav: DocNavItem[] = [
  {
    title: "Overview",
    href: "/",
    description: "The icon CDN proof of concept and usage guidance.",
  },
  {
    title: "Icons",
    href: "/icons",
    description: "Search, filter, and download SVGs from the CDN pack.",
  },
];
