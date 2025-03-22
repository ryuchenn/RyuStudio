
export const MENU_ITEMS = [
    {
      title: "Home",
      route: "/",
    },
    {
        title: "Studio",
        route: "/studio",
        subItems: [
          { title: "Photography", route: "/studio/photoA" },
          { title: "Music", route: "/studio/musicA" },
        ],
    },
    {
        title: "Portfolio",
        route: "/portfolio",
        subItems: [
            { title: "Photography", route: "/portfolio/photography" },
            { title: "Videography", route: "/portfolio/videography" },
            { title: "Music", route: "/portfolio/music" },
            { title: "Web / App", route: "/portfolio/coding" },
        ],
    },
    {
        title: "Project",
        route: "/project",
    },
    // {
    //     title: "Event",
    //     route: "/event",
    // },
    {
        title: "About",
        route: "/about",
    },
    {
        title: "Book",
        route: "/book",
    },
    {
        title: "Contact",
        route: "/contact",
    },
]
