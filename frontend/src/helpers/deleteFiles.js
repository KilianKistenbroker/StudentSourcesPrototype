import axios from "../api/axios";

const parseAndDelete = async (node) => {
  console.log("deleting: ");
  console.log(node.name);

  try {
    await axios.delete(`/file/${node.id}`).then((res) => {
      console.log(res.data);
    });

    if (node.type !== "Folder") {
      const key = node.id + "." + node.type;
      await axios.delete(`/deleteFile/${key}`).then((res) => {
        console.log(res);
      });
    }
  } catch (error) {
    console.log(error);
  }

  for (let i = 0; i < node.items.length; i++) {
    parseAndDelete(node.items[i]);
  }
};

export default parseAndDelete;
