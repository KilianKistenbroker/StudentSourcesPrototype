// const finalTree = insertNode(currentDirectory, id, name, type);
import uploadJson from "../helpers/uploadJson";
import axios from "../api/axios";

const useTreeTraversal = () => {
  function insertNode(
    explorerData,
    currentDirectory,
    name,
    type,
    data,
    setMessage
  ) {
    if (currentDirectory.items.some((item) => item.name === name)) {
      // prompt skip or replace
    } else {
      let dataUrl = "";

      // convert.com to .url file
      if (type === "url") {
        dataUrl =
          "application/octet-stream;base64," + window.btoa("URL=" + name);
      }

      const regex = /[\/:.?]/g;
      const adjustedForPathname = name.replace(regex, "_");

      currentDirectory.items.push({
        id: new Date().getTime(), // placeholder until successfully created in table
        pathname: currentDirectory.pathname + "/" + adjustedForPathname,
        name,
        type,
        size: 0,
        isPinned: false,
        visibility: "Private", // <-default
        permissions: "Only you have access",
        dataUrl: dataUrl,
        notes: "",
        items: [],
      });

      currentDirectory.items.sort((a, b) => {
        let fa = a.name.toLowerCase(),
          fb = b.name.toLowerCase();

        return fa.localeCompare(fb, undefined, { numeric: true });
      });

      let folders = [];
      let files = [];
      for (let i = 0; i < currentDirectory.items.length; i++) {
        if (currentDirectory.items[i].type === "Folder")
          folders.push(currentDirectory.items[i]);
        else files.push(currentDirectory.items[i]);
      }
      const updateitems = folders.concat(files);
      currentDirectory.items = updateitems;

      try {
        axios
          .post(`/postFile/${data.id}/${adjustedForPathname}`)
          .then((res) => {
            console.log(res.data);
            for (let i = 0; i < currentDirectory.items.length; i++) {
              if (currentDirectory.items[i].name === name) {
                currentDirectory.items[i].id = res.data;
              }
            }
            const ret = uploadJson(`${data.id}`, explorerData);
          });
      } catch (error) {
        // remove the the inserted node from current directory
        console.log(error);

        let tempItemsArr = [];
        for (let i = 0; i < currentDirectory.items.length; i++) {
          if (currentDirectory.items[i].name !== name) {
            tempItemsArr.push(currentDirectory.items[i]);
          }
        }
        currentDirectory.items = tempItemsArr;
      }
    }
  }

  return { insertNode };
};

export default useTreeTraversal;
