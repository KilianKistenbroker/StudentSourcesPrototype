import { saveAs } from "file-saver";
import axios from "../api/axios";

const downloadFile = async (currentFile, data) => {
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
    // const adjustedKey = currentFile.id + "." + currentFile.type;
    const checkType = currentFile.name.split(".");

    // adjusting file name with proper extention
    let fileName = currentFile.name;
    if (checkType[checkType.length - 1] !== currentFile.type) {
      fileName = currentFile.name + "." + currentFile.type;
    }

    try {
      const res = await axios.get(
        `/downloadFile/${currentFile.id}/${data.id}/${data.token}`,
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([res.data]);
      saveAs(blob, fileName);
    } catch (error) {
      // console.log(error);
    }
  }
};

export default downloadFile;
