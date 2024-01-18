import axios from "../api/axios";

const handleFolderSearch = async (e, setLoadFolders, search) => {
  try {
    e.preventDefault();

    let str2 = search.toLowerCase();
    str2 = str2.replace(/ +/g, "");

    if (str2.length === 0) {
      const res = await axios.get("/getAllFiles");
      setLoadFolders(res.data);

      // fetch query results from backend
    } else {
      const res = await axios.get(`/searchFolder/${search}`);
      if (res.data.length === 0) setLoadFolders([]);
      else setLoadFolders(res.data);
    }
  } catch (error) {
    // console.log(error);
  }
};

export default handleFolderSearch;
