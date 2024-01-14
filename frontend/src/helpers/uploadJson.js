import axios from "../api/axios";

const uploadJson = async (data, jsonData, fileKey) => {
  const adjustedKey = data.id + ".json";
  const stringifiedData = JSON.stringify(jsonData);
  const blob = new Blob([stringifiedData], { type: "application/json" });
  const formData = new FormData();
  formData.append("file", blob, adjustedKey);
  try {
    if (fileKey) {
      console.log("secure json upload");
      await axios.post(
        `/uploadSecureJson/${adjustedKey}/${fileKey}/${data.id}/${data.token}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else {
      console.log("soft json upload");
      await axios.post(`/uploadJson/${data.id}/${data.token}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    console.log(jsonData);

    return 0;
  } catch (error) {
    return -1;
  }
};

export default uploadJson;
