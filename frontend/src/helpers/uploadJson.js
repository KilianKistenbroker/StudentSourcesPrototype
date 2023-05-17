import axios from "../api/axios";

const uploadJson = async (key, jsonData) => {
  const adjustedKey = key + ".json";

  const stringifiedData = JSON.stringify(jsonData);

  const blob = new Blob([stringifiedData], { type: "application/json" });
  const formData = new FormData();
  formData.append("file", blob, adjustedKey);
  try {
    await axios.post(`/uploadJson/${adjustedKey}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return 0;
  } catch (error) {
    return -1;
  }
};

export default uploadJson;
