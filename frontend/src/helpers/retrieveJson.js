import axios from "../api/axios";

const retrieveJson = async (key) => {
  const adjustedKey = key + ".json";
  try {
    const res = await axios.get(`/downloadJson/${adjustedKey}`);
    return res.data;
  } catch (error) {
    console.error("Error downloading JSON data:", error);
    return -1;
  }
};

export default retrieveJson;
