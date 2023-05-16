import { saveAs } from "file-saver";
import axios from "../api/axios";

const downloadFile = (currentFile) => {
  if (currentFile.type === "url") {
    const fileURL = currentFile.dataUrl;
    const fileURLParts = fileURL.split(",");
    const byteString = window.atob(fileURLParts[1]);

    const urlFileContent = `[InternetShortcut]\n${byteString}\n`;
    const blob = new Blob([urlFileContent], {
      type: "application/internet-shortcut",
    });

    const fileName = currentFile.name.endsWith(".url")
      ? currentFile.name
      : `${currentFile.name}.url`;

    saveAs(blob, fileName);
  } else {
    const adjustedKey = currentFile.id + "." + currentFile.type;
    const checkType = currentFile.name.split(".");

    // adjusting file name with proper extention
    let fileName = currentFile.name;
    if (checkType[checkType.length - 1] !== currentFile.type) {
      fileName = currentFile.name + "." + currentFile.type;
    }

    try {
      axios
        .get(`/downloadFile/${adjustedKey}`, {
          responseType: "blob",
        })
        .then((res) => {
          const blob = new Blob([res.data]);
          saveAs(blob, fileName);
        });
    } catch (error) {
      console.log(error);
    }
  }

  // if (currentFile.type === "txt") {
  //   const updatedContent = currentFile.dataUrl;
  //   const fileURLParts = updatedContent.split(",");
  //   const byteString = window.atob(fileURLParts[1]);

  //   const blob = new Blob([byteString], {
  //     type: "text/plain;charset=utf-8",
  //   });

  //   saveAs(blob, currentFile.name);
  // } else if (currentFile.type === "url") {
  //   const fileURL = currentFile.dataUrl;
  //   const fileURLParts = fileURL.split(",");
  //   const byteString = window.atob(fileURLParts[1]);

  //   const urlFileContent = `[InternetShortcut]\n${byteString}\n`;
  //   const blob = new Blob([urlFileContent], {
  //     type: "application/internet-shortcut",
  //   });

  //   const fileName = currentFile.name.endsWith(".url")
  //     ? currentFile.name
  //     : `${currentFile.name}.url`;

  //   saveAs(blob, fileName);
  // } else if (
  //   [["jpeg", "jpg", "gif", "png", "pdf"].includes(currentFile.type)]
  // ) {
  //   const imgURL = currentFile.dataUrl;
  //   const imgDataUrlParts = imgURL.split(",");
  //   const byteString = window.atob(imgDataUrlParts[1]);
  //   const mimeString = imgDataUrlParts[0].split(":")[1].split(";")[0];
  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);

  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }

  //   const blob = new Blob([ab], { type: mimeString });
  //   saveAs(blob, currentFile.name);
  // } else {
  //   // send request to backend to download unsupported files
  // }
};

export default downloadFile;
