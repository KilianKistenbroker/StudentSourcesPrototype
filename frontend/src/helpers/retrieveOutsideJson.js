import axios from "../api/axios";

const retrieveOutsideJson = async (key) => {
  const adjustedKey = key + ".json";
  try {
    const res = await axios.get(`/downloadOutsideJson/${adjustedKey}`);
    return res.data;
  } catch (error) {
    console.error("Error downloading JSON data:");
    console.log(error);
    return -1;
  }
};

export default retrieveOutsideJson;
