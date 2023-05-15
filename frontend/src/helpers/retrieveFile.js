import axios from "../api/axios";

const retrieveFile = async (key, type) => {
  const adjustedKey = key + "." + type;
  console.log(adjustedKey);
  try {
    const res = await axios.get(`/downloadFile/${adjustedKey}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error downloading JSON data:", error);
    return -1;
  }
};

export default retrieveJson;
