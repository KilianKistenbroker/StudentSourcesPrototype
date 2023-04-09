const explorer = {
  id: "1",
  name: "Home",
  type: "folder",
  items: [
    /* all the users content will be 
        nested inside this folder, and 
        retrieved from backend */

    {
      id: "2",
      name: "public",
      type: "folder",
      items: [
        {
          id: "3",
          name: "public nested 1",
          type: "folder",
          items: [
            {
              id: "4",
              name: "index.txt",
              type: "txt",
              items: [],
            },
            {
              id: "5",
              name: "hello.pdf",
              type: "pdf",
              items: [],
            },
          ],
        },
      ],
    },

    {
      id: "6",
      name: "src",
      type: "folder",
      items: [
        {
          id: "7",
          name: "public nested 2",
          type: "folder",
          items: [
            {
              id: "8",
              name: "about.jpg",
              type: "jpg",
              items: [],
            },
            {
              id: "9",
              name: "home.mp4",
              type: "mp4",
              items: [],
            },
          ],
        },
      ],
    },
  ],
};

export default explorer;
