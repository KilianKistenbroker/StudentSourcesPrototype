import axios from "../api/axios";

const handleUserSearch = async (e, setLoadUsers, search, getFriends) => {
  try {
    e.preventDefault();

    getFriends();

    let str2 = search.toLowerCase();
    str2 = str2.replace(/ +/g, "");

    if (str2.length === 0) {
      const res = await axios.get("/users");
      setLoadUsers(res.data);

      // fetch query results from backend
    } else {
      const res = await axios.get(`/search/${search}`);
      if (res.data.length === 0) setLoadUsers([]);
      else setLoadUsers(res.data);
    }
  } catch (error) {
    // console.log(error);
  }
};

export default handleUserSearch;
