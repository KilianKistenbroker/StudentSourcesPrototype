// -------- adjust later to only store meta data -------- //

import axios from "../api/axios";
import uploadFile from "./uploadFile";
import uploadJson from "./uploadJson";

// TEMPORARY ID
let globalID = 100;

// this will probably only be used when retreiving files from backend
const readFileContent = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

const readEntries = async (
  entry,
  parent,
  path,
  data,
  explorerData,
  setLoading,
  setMessage,
  setSplashMsg,
  setLoadingBar
) => {
  // adjust name to remove '/' this shouldn't be a problem, but just in case
  const regex = new RegExp("/", "g");
  const adjustedForPathname = entry.name.replace(regex, "%");

  const currentPath = path
    ? `${path}/${adjustedForPathname}`
    : adjustedForPathname;

  if (entry.isFile) {
    const nameAndType = entry.name.split(".");

    return new Promise(async (resolve) => {
      entry.file(async (file) => {
        try {
          if (explorerData.size + file.size > 1e9) {
            console.log("exceeded storage limit");
            setLoadingBar({
              filename: null,
              progress: null,
            });
            setLoading(false);
            setMessage({
              title: "Uh-oh!",
              body: "Looks like some files exceed the available storage space on this account. Try deleting files from trash bin to free up space.",
            });
            resolve();
            return;
          }

          const res = await uploadFile(
            -1,
            file,
            setLoadingBar,
            parent.pathname,
            data
          );

          if (res < 0) {
            resolve();
            return;
          }

          const newItem = {
            id: res,
            name: nameAndType[0] + "." + nameAndType[nameAndType.length - 1],
            pathname: currentPath,
            type: nameAndType[nameAndType.length - 1],
            size: file.size,
            isPinned: false,
            visibility: "Private",
            permissions: "Only you have access",
            dataUrl: "",
            notes: "",
            items: [],
          };
          parent.items.push(newItem);

          // sort parent node
          sortItem(parent);

          // update all the parents of newly inserted node
          let parsingArr = parent.pathname.split("/");
          const res1 = updateParentSize(explorerData, parsingArr, newItem.size);
          const ret = uploadJson(data, explorerData, res);

          if (ret === -1) {
            setSplashMsg({
              message: "Upload failed!",
              isShowing: true,
            });
          } else {
            setSplashMsg({
              message: `Uploaded ~ ${entry.name}`,
              isShowing: true,
            });
          }

          resolve();
        } catch (error) {
          console.log(error);
          return;
        }
      });
    });
  } else if (entry.isDirectory) {
    try {
      // ------------ MOVE TO BACKEND (Cap folders to 10 per user) ------------ //

      const res = await axios.post(
        `/postFolder/${data.id}/${entry.name}/${data.token}`
      );

      if (res.data === -1) return;

      // TODO: HIDE THIS OBJECT IN BACKEND
      const newFolder = {
        id: res.data, // <-- REPLACE WITH DB GENERATED ID
        name: entry.name,
        pathname: currentPath,
        type: "Folder",
        size: 0,
        isPinned: false,
        visibility: "Private",
        permissions: "Only you have access",
        dataUrl: "",
        notes: "",
        items: [],
      };

      // ------------ MOVE TO BACKEND (end) ------------ //

      // if key is successful, then proceed, otherwise return

      parent.items.push(newFolder);

      // sort parent node
      sortItem(parent);

      const reader = entry.createReader();

      const readAllEntries = async () => {
        return new Promise((resolve) => {
          reader.readEntries(async (entries) => {
            if (entries.length === 0) {
              resolve();
              return;
            }

            for (let i = 0; i < entries.length; i++) {
              const e = entries[i];
              globalID += 1;
              await readEntries(
                e,
                newFolder,
                currentPath,
                data,
                explorerData,
                setLoading,
                setMessage,
                setSplashMsg,
                setLoadingBar
              );
            }
            await readAllEntries(); // Recursively call readAllEntries()
            resolve();
          });
        });
      };
      return readAllEntries();
    } catch (error) {
      console.log(error);
      return;
    }
  }
};

const sortItem = (node) => {
  node.items.sort((a, b) => {
    let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();

    return fa.localeCompare(fb, undefined, { numeric: true });
  });

  // this may never be needed here ...
  let folders = [];
  let files = [];
  for (let i = 0; i < node.items.length; i++) {
    if (node.items[i].type === "Folder") folders.push(node.items[i]);
    else files.push(node.items[i]);
  }
  const updateitems = folders.concat(files);
  node.items = updateitems;
};

const updateParentSize = (node, parsingArr, size) => {
  parsingArr.shift();
  if (parsingArr.length === 0) {
    node.size += size;
    return node;
  }
  node.size += size;
  for (let i = 0; i < node.items.length; i++) {
    if (node.items[i].name === parsingArr[0]) {
      node.items[i] = updateParentSize(node.items[i], parsingArr, size);
      return node;
    }
  }
};

// ------- gets all contents of dropped item, and converts into a tree that i can render -------- //

const readDroppedFiles = async (
  items,
  node,
  data,
  explorerData,
  setLoading,
  setMessage,
  setSplashMsg,
  setLoadingBar
) => {
  const relPath = JSON.parse(JSON.stringify(node.pathname));

  if (items.dataTransfer) {
    for (let i = 0; i < items.dataTransfer.items.length; i++) {
      globalID += 1;
      const item = items.dataTransfer.items[i];
      const entry = item.webkitGetAsEntry();
      if (entry) {
        await readEntries(
          entry,
          node,
          relPath,
          data,
          explorerData,
          setLoading,
          setMessage,
          setSplashMsg,
          setLoadingBar
        );
      }
    }
  } else {
    // for files only
    for (let i = 0; i < items.target.files.length; i++) {
      globalID += 1;
      const file = items.target.files[i];
      const entry = {
        isFile: true,
        name: file.name,
        file: (callback) => callback(file),
      };
      await readEntries(
        entry,
        node,
        relPath,
        data,
        explorerData,
        setLoading,
        setMessage,
        setSplashMsg,
        setLoadingBar
      );
    }
  }

  setLoadingBar({
    filename: null,
    progress: null,
    pathname: null,
  });
  setSplashMsg({ message: "Finished uploading!", isShowing: true });

  setLoading(false);
  return 0;
};

export default readDroppedFiles;
