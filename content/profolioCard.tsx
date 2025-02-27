export const photographyCategories = ["All", "Portrait", "Wedding", "Pet", "Event", "Product", "Other"];
export const videographyCategories = ["All", "Movie", "MV", "Shorts"];
export const musicCategories = ["All", "DJ", "PA", "MV", "Recording", "Composition"];

export const allImages = [
  //////////////// Photography ////////////////
  { id: 1, type: "Photography", category: ["Portrait", "Wedding"], src: "/assets/test/Test9.jpg", title: "Portrait 1" },
  { id: 2, type: "Photography", category: ["Portrait", "Wedding"], src: "/assets/test/Test8.jpg", title: "Portrait 2" },
  { id: 3, type: "Photography", category: ["Pet"], src: "/assets/test/Test1.jpg", title: "Pet 1" },
  { id: 4, type: "Photography", category: ["Event"], src: "/assets/test/Test2.jpg", title: "Event 1" },
  { id: 5, type: "Photography", category: ["Wedding"], src: "/assets/test/Test3.jpg", title: "Wedding 1" },
  { id: 6, type: "Photography", category: ["Other"], src: "/assets/test/Test4.jpg", title: "Other 2" },
  { id: 7, type: "Photography", category: ["Wedding"], src: "/assets/test/Test7.jpg", title: "Wedding 2" },
  { id: 8, type: "Photography", category: ["Product"], src: "/assets/test/Test5.jpg", title: "Product 1" },
  { id: 9, type: "Photography", category: ["Event"], src: "/assets/test/Test6.jpg", title: "Event 2" },
  { id: 10, type: "Photography", category:["Pet"], src: "/assets/test/Test10.jpg", title: "Pet 2" },
  { id: 11, type: "Photography", category:["Product"], src: "/assets/test/Test0-1.webp", title: "Product 2" },

  //////////////// Videography ////////////////
  { id: 12, type: "Videography", category: ["Movie"], src: "/assets/test/Test7.jpg", title: "Video 1" },
  { id: 13, type: "Videography", category: ["MV"], src: "/assets/test/Test10.jpg", title: "Video 2" },
  { id: 14, type: "Videography", category: ["Shorts"], src: "/assets/test/Test6.jpg", title: "Video 3" },

  //////////////// Music ////////////////
  { id: 15, type: "Music", category: ["DJ"], src: "/assets/test/Test9.jpg", title: "Music 1" },
  { id: 16, type: "Music", category: ["PA"], src: "/assets/test/Test8.jpg", title: "Music 2" },
  { id: 17, type: "Music", category: ["Recording"], src: "/assets/test/Test5.jpg", title: "Music 1" },
]

export const detailAllImages = [
  ////////////////////////////////////////////////
  //////////////// Photography ////////////////
  ////////////////////////////////////////////////
  {
    id: 1,
    title: "Portrait 1",
    images: [
      "/assets/test/Test9.jpg",
    ],
    content: (
      <p>
        This is a text description for Portrait.
      </p>
    ),
  },
  {
    id: 2,
    title: "Portrait 2",
    images: [
      "/assets/test/Test8.jpg",
    ],
    content: (
      <p>
        This is a text description for Portrait.
      </p>
    ),
  },
  {
    id: 3,
    title: "Pet 1",
    images: [
      "/assets/test/Test1.jpg",
    ],
    content: (
      <p>
        This is a text description for Portrait.
      </p>
    ),
  },
  {
    id: 4,
    title: "Event 1",
    images: [
      "/assets/test/Test2.jpg",
    ],
    content: (
      <p>
        This is a text description for Portrait.
      </p>
    ),
  },
  {
    id: 5,
    title: "Wedding 1",
    images: [
      "/assets/test/Test3.jpg",
    ],
    content: (
      <p>
        This is a text description for Portrait.
      </p>
    ),
  },
  {
    id: 6,
    title: "Other 2",
    images: [
      "/assets/test/Test4.jpg",
    ],
    content: (
      <p>
        This is a text description for Portrait.
      </p>
    ),
  },
  {
    id: 7,
    title: "Wedding 2",
    images: [
      "/assets/test/Test7.jpg",
    ],
    content: (
      <p>
        This is a text description for Portrait.
      </p>
    ),
  },
  {
    id: 8,
    title: "Product 1",
    images: [
      "/assets/test/Test5.jpg",
    ],
    content: (
      <p>
        This is a text description for Portrait.
      </p>
    ),
  },
  {
    id: 9,
    title: "Event 2",
    images: [
      "/assets/test/Test6.jpg",
    ],
    content: (
      <p>
        This is a text description for Portrait.
      </p>
    ),
  },
  {
    id: 10,
    title: "Pet 2",
    images: [
      "/assets/test/Test10.jpg",
    ],
    content: (
      <p>
        This is a text description for Portrait.
      </p>
    ),
  },
  {
    id: 11,
    title: "Product 2",
    images: [
      "/assets/test/Test0-1.webp",
    ],
    content: (
      <p>
        This is a text description for Portrait.
      </p>
    ),
  },
  
  ////////////////////////////////////////////////
  //////////////// Videography ////////////////
  ////////////////////////////////////////////////
  {
    id: 12,
    title: "Videography 1",
    images: ["/assets/test/Test7.jpg"],
    content: (
      <iframe
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        allowFullScreen
      ></iframe>
    ),
  },
  {
    id: 13,
    title: "Video 2",
    images: ["/assets/test/Test10.jpg"],
    content: (
      <iframe
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        allowFullScreen
      ></iframe>
    ),
  },
  {
    id: 14,
    title: "Video 3",
    images: ["/assets/test/Test6.jpg"],
    content: (
      <iframe
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        allowFullScreen
      ></iframe>
    ),
  },

  ////////////////////////////////////////////////
  //////////////// Music ////////////////
  ////////////////////////////////////////////////
  {
    id: 15,
    category: "DJ",
    title: "Music 1",
    images: ["/assets/test/Test9.jpg"],
    content: (
      <iframe
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        allowFullScreen
      ></iframe>
    ),
  },
  {
    id: 16,
    category: "PA",
    title: "Video 2",
    images: ["/assets/test/Test8.jpg"],
    content: (
      <iframe
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        allowFullScreen
      ></iframe>
    ),
  },
  {
    id: 17,
    category: "Recording",
    title: "Music 3",
    images: ["/assets/test/Test5.jpg"],
    content: (
      <iframe
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        allowFullScreen
      ></iframe>
    ),
  },
];

