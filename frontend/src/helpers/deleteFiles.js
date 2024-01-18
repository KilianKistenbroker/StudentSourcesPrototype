import axios from "../api/axios";

const parseAndDelete = async (node, data, exploreData) => {
  const adjustedKey = data.id + ".json";
  const stringifiedData = JSON.stringify(exploreData);
  const blob = new Blob([stringifiedData], { type: "application/json" });
  const formData = new FormData();
  formData.append("file", blob, adjustedKey);

  try {
    // console.log("delete node id: " + node.id);
    await axios.post(
      `/deleteFile/${node.id}/${data.id}/${data.token}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    // console.log(error);
  }
};

export default parseAndDelete;
