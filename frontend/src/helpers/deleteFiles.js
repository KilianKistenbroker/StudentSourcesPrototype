import axios from "../api/axios";

const parseAndDelete = async (node) => {
  try {
    await axios.delete(`/file/${node.id}`);

    if (node.type !== "Folder") {
      const key = node.id + "." + node.type;
      await axios.delete(`/deleteFile/${key}`);
    }
  } catch (error) {
    console.log(error);
  }

  for (let i = 0; i < node.items.length; i++) {
    parseAndDelete(node.items[i]);
  }
};

export default parseAndDelete;
