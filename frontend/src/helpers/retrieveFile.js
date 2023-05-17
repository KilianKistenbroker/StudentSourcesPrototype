import axios from "../api/axios";

const retrieveFile = async (key, type) => {
  const adjustedKey = key + "." + type;
  try {
    const res = await axios.get(`/downloadFile/${adjustedKey}`);
    return res.data;
  } catch (error) {
    console.error("Error downloading JSON data:", error);
    return -1;
  }
};

export default retrieveJson;
