import JSZip from "jszip";

// function to add a file to the zip
function addFileToZip(zip, name, data) {
  zip.file(name, data);
}

// function to add a folder to the zip
function addFolderToZip(zip, folder) {
  const newFolder = zip.folder(folder.name);
  for (const item of folder.items) {
    // retreive this items dataURL from bucket

    if (item.type === "Folder") {
      addFolderToZip(newFolder, item);
    } else {
      const data = window.atob(item.dataUrl.split("base64,")[1]);
      addFileToZip(newFolder, item.name, data, { base64: true });
    }
  }
}

// function to create and download the zip
async function downloadZip(folder) {
  // gather dataURL from bucket???

  const zip = new JSZip();
  addFolderToZip(zip, folder);
  const content = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);

  //   change this to folder name
  link.download = "explorer.zip";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default downloadZip;
