import axios from "../api/axios";

const retrieveJson = async (data) => {
  const adjustedKey = data.id + ".json";
  try {
    const res = await axios.get(
      `/downloadJson/${adjustedKey}/${data.id}/${data.token}`
    );
    return res.data;
  } catch (error) {
    console.error("Error downloading JSON data:", error);
    return -1;
  }
};

export default retrieveJson;
