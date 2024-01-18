const explorer = {
  id: -1,
  name: "Home",
  pathname: "Home",
  type: "Folder",
  size: 0,
  isPinned: false,
  visibility: "Public",
  permissions: "Can view only",
  dataUrl: "",
  notes: "",
  items: [
    {
      id: -1, // i don't think an id needs to be created here
      name: "~Trash",
      pathname: "Home/~Trash",
      type: "Folder",
      size: 0,
      isPinned: false,
      visibility: "Private",
      permissions: "Only you have access",
      dataUrl: "",
      notes: "",
      items: [],
    },
    {
      id: -1,
      name: "Supported file types.txt",
      pathname: "Home/Supported file types.txt",
      type: "txt",
      size: 327,
      isPinned: false,
      visibility: "Private",
      permissions: "Only you have access",
      dataUrl:
        "Supported file types:\n\ntxt, url, jpg, png, gif, pdf, mp3, mp4, mov.",
      items: [],
    },
    {
      id: -1,
      name: "Helpful Information.txt",
      pathname: "Home/Helpful information.txt",
      type: "txt",
      size: 327,
      isPinned: false,
      visibility: "Private",
      permissions: "Only you have access",
      dataUrl:
        "Helpful information:\n\nAll uploaded data is automatically deleted daily at 11:59 PM (23:59) UTC time.",
      items: [],
    },
  ],
};

export default explorer;
