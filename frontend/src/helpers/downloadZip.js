import JSZip from "jszip";
import axios from "../api/axios";

// function to add a file to the zip
async function addFileToZip(zip, name, data) {
  zip.file(name, await data.arrayBuffer());
}

// function to add a folder to the zip
async function addFolderToZip(zip, folder, state) {
  const newFolder = zip.folder(folder.name);
  for (const item of folder.items) {
    if (state === "visiter" && item.permissions === "Can view only") {
    } else {
      if (item.type === "Folder") {
        await addFolderToZip(newFolder, item, state);

        // only files from s3 bucket are zipped up
      } else {
        const adjustedKey = item.id + "." + item.type;
        try {
          const response = await axios.get(`/downloadFile/${adjustedKey}`, {
            responseType: "blob",
          });
          await addFileToZip(newFolder, item.name, response.data);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}

// function to create and download the zip
async function downloadZip(folder, state) {
  if (state === undefined) {
    const zip = new JSZip();
    if (state === undefined) {
      await addFolderToZip(zip, folder, "owner");
    } else {
      await addFolderToZip(zip, folder, state);
    }
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "explorer.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default downloadZip;
