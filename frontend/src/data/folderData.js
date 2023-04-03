const explorer = {
  id: "1",
  name: "root",
  isFolder: true,
  items: [
    /* all the users content will be 
        nested inside this folder, and 
        retrieved from backend */

    {
      id: "2",
      name: "public",
      isFolder: true,
      items: [
        {
          id: "3",
          name: "public nested 1",
          isFolder: true,
          items: [
            {
              id: "4",
              name: "index.html",
              isFolder: false,
              items: [],
            },
            {
              id: "5",
              name: "hello.html",
              isFolder: false,
              items: [],
            },
          ],
        },
      ],
    },

    {
      id: "6",
      name: "src",
      isFolder: true,
      items: [
        {
          id: "7",
          name: "public nested 2",
          isFolder: true,
          items: [
            {
              id: "8",
              name: "about.html",
              isFolder: false,
              items: [],
            },
            {
              id: "9",
              name: "home.html",
              isFolder: false,
              items: [],
            },
          ],
        },
      ],
    },
  ],
};

export default explorer;
