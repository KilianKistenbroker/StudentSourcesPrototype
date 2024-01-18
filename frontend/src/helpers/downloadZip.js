import JSZip from "jszip";
import axios from "../api/axios";

// function to add a file to the zip
async function addFileToZip(zip, name, fileData) {
  zip.file(name, await fileData.arrayBuffer());
}

// function to add a folder to the zip
async function addFolderToZip(zip, folder, state, data) {
  const newFolder = zip.folder(folder.name);
  for (const item of folder.items) {
    if (state === "visiter" && item.permissions === "Can view only") {
    } else {
      if (item.type === "Folder") {
        await addFolderToZip(newFolder, item, state, data);

        // only files from s3 bucket are zipped up
      } else {
        const adjustedKey = item.id + "." + item.type;
        try {
          const response = await axios.get(
            `/downloadFile/${item.id}/${data.id}/${data.token}`,
            {
              responseType: "blob",
            }
          );
          await addFileToZip(newFolder, item.name, response.data);
        } catch (error) {
          // console.log(error);
        }
      }
    }
  }
}

// function to create and download the zip
async function downloadZip(folder, state, data) {
  if (state === undefined) {
    const zip = new JSZip();
    if (state === undefined) {
      await addFolderToZip(zip, folder, "owner", data);
    } else {
      await addFolderToZip(zip, folder, state, data);
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
