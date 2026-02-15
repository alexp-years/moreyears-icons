export type DocNavItem = {
  title: string;
  href: string;
  description: string;
};

export type DocNavSection = {
  id: "home" | "shapes" | "help";
  title: string;
  href?: string;
  description: string;
  items?: DocNavItem[];
};

export const docsNav: DocNavSection[] = [
  {
    id: "home",
    title: "Home",
    href: "/",
    description: "Project overview and main documentation entry points.",
    items: [
      {
        title: "Introduction",
        href: "/home/introduction",
        description:
          "For developers to understand how to use this project within web workflows.",
      },
      {
        title: "Explore icons",
        href: "/home/explore-icons",
        description:
          "For developers to understand how to use these icons within web projects.",
      },
      {
        title: "Documentation",
        href: "/home/documentation",
        description:
          "For developers to understand CDN and package usage within web projects.",
      },
    ],
  },
  {
    id: "shapes",
    title: "Shapes",
    description: "Placeholder area for shape strategy and reusable assets.",
    items: [
      {
        title: "Introduction",
        href: "/shapes/introduction",
        description: "Overview of our approach to shapes and brand geometry.",
      },
      {
        title: "Shape library",
        href: "/shapes/library",
        description: "Placeholder for squircles and future shape primitives.",
      },
    ],
  },
  {
    id: "help",
    title: "Help",
    href: "/help",
    description: "How to update and maintain this project over time.",
  },
];

export const homeSection = docsNav.find((section) => section.id === "home");
