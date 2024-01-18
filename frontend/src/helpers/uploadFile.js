import axios from "../api/axios";

const uploadFile = async (key, file, setLoadingBar, pathname, data) => {
  const type = file.name.split(".").pop();
  const formData = new FormData();
  formData.append("file", file);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: function (progressEvent) {
      setLoadingBar({
        filename: file.name,
        progress: Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        ),
        pathname: pathname,
      });
    },
  };

  try {
    // console.log("filename: " + file.name);
    if (key > 0) {
      const res = await axios.post(
        `/updateFile/${data.id}/${key}/${type}/${data.token}`,
        formData,
        config
      );
      return res.data;
    } else {
      const res = await axios.post(
        `/postFile/${data.id}/${file.name}/${type}/${data.token}`,
        formData,
        config
      );
      return res.data;
    }
  } catch (error) {
    return -1;
  }
};

export default uploadFile;
