
import { Theme } from "./types";

export const data = {
  user: {
    name: "John Doe",
    email: "xX2Y2@example.com",
    avatar: "/asa",
  },

  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: "/as",
    },
    {
      title: "Templates",
      url: "/templates",
      icon: "/as",
    },
    {
      title: "Trash",
      url: "/trash",
      icon: "/as",
    },
  ],
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export const themes: Theme[] = [
  {
    name: "Default",
    fontFamily: "Inter, sans-serif",
    fontColor: "#000000",
    backgroundColor: "#f0f0f0",
    slideBackgroundColor: "#ffffff",
    accentColor: "#3b82f6",
    navbarColor: "#ffffff",
    sidebarColor: "#f0f0f0",
    type: "light",
  },
];
