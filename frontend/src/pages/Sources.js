import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import FriendsAll from "../components/FriendsAll";
import FriendsPending from "../components/FriendsPending";
import SavedAll from "../components/SavedAll";
import Users from "../components/Users";

const Sources = ({ data }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // store these in local browser to remember after refresh
  const [selected, setSelected] = useState("users");
  const [friends, setFriends] = useState("all");

  // these are loaded immediately on login or refresh
  const [loadFriends, setLoadFriends] = useState([]);
  const [loadPending, setLoadPending] = useState([]);
  const [loadSaved, setLoadSaved] = useState([]);

  // these are loaded after submitting a search query
  const [loadUsers, setLoadUsers] = useState([]);
  const [loadFolders, setLoadFolders] = useState([]);

  // these are arrays of u-id's for quick referencing
  const [friendsList, setFriendsList] = useState([]);
  const [sentList, setSentList] = useState([]);
  const [savedUserList, setSavedUserList] = useState([]);
  const [pendingList, setPendingList] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // -------- call essential getters here on re-render ----------
  useEffect(() => {
    if (!data.isLoggedIn) {
      data.currentPoint = "login";
      navigate("/login");
      return;
    }

    getFriends();
    getPending();
    getSaved();

    setLoading(false);
  }, []);

  const getFriends = async (e) => {
    setLoading(true);
    const res = await axios.get(`/findFriends/${data.id}`);

    for (let i = 0; i < res.data.length; i++) {
      friendsList.push(res.data[i].id);
    }
    setLoadFriends(res.data);
    setFriendsList(friendsList);
    setLoading(false);
  };

  /* these functions will set selected to friends, 
and also call request to update lists */

  const handleSetFriends = (selected) => {
    setLoading(true);
    getFriends();
    setSelected("friends");
    setFriends(selected);
    setLoading(false);
  };

  const handleSetSelected = (select) => {
    setLoading(true);
    if (selected === "saved") getSaved();
    else if (selected === "friends") getFriends();
    setSelected(select);
    setLoading(false);
  };

  //  get users with given username, first, or last name
  const handleUserSearch = async (e) => {
    e.preventDefault();
    getFriends();

    let str2 = search.toLowerCase();
    str2 = str2.replace(/ +/g, "");

    if (str2 === "all") {
      const res = await axios.get("/users");
      setLoadUsers(res.data);
      console.log(res.data);
    } else {
      const res = await axios.get(`/search/${search}`);
      if (res.data.length === 0) setLoadUsers([]);
      else setLoadUsers(res.data);
    }
  };

  const handleFilterSearch = (filter, item) => {
    /* this can probably be done on the frontend 
    since friends are immediately loaded here */

    const str1 =
      item.user.toLowerCase() +
      item.firstName.toLowerCase() +
      item.lastName.toLowerCase();
    let str2 = filter.toLowerCase();
    str2 = str2.replace(/ +/g, "");

    if (filter.length === 0) return true;

    if (str1.includes(str2)) return true;
    return false;
  };

  const getPending = async () => {
    // get sent/pending requests here
    const senderRes = await axios.get(`/getSent/${data.id}`);
    const recieverRes = await axios.get(`/getPending/${data.id}`);

    let tempSenderList = [];
    let tempPendingList = [];

    for (let i = 0; i < senderRes.data.length; i++) {
      tempSenderList.push(senderRes.data[i].fk_receiver_id);
    }

    for (let i = 0; i < recieverRes.data.length; i++) {
      tempPendingList.push(recieverRes.data[0].id);
    }

    setSentList(tempSenderList);
    setLoadPending(recieverRes.data);
    setPendingList(tempPendingList);
  };

  //   gets all of users saved items
  const getSaved = async () => {
    setLoading(true);

    const res = await axios.get(`/mySavedUsers/${data.id}`);
    let tempSaveUserList = [];

    for (let i = 0; i < res.data.length; i++) {
      tempSaveUserList.push(res.data[i].id);
    }

    setLoadSaved(res.data);
    setSavedUserList(tempSaveUserList);
    setLoading(false);
  };

  async function removeSaved(isUser, item_id) {
    // setRemoveInProg(true);

    const getRes = await axios.delete(`/deleteSavedUser/${data.id}/${item_id}`);

    if (isUser) {
      let tempList1 = [];
      for (let i = 0; i < savedUserList.length; i++) {
        if (savedUserList[i] !== item_id) tempList1.push(savedUserList[i]);
      }
      setSavedUserList(tempList1);
    } else {
      // adding to folder list here
    }

    // refresh saved list
    if (selected !== "saved") getSaved();
  }

  async function insertSaved(isUser, item_id) {
    // insert user into this user's saved items list.
    const user_id = data.id;
    const response = await axios.post("/savedUsers", {
      fk_user_id: user_id,
      fk_item_id: item_id,
      isUser,
    });

    if (isUser) {
      let tempList = savedUserList;
      tempList.push(item_id);
      setSavedUserList(tempList);
    } else {
      // adding to folder list here
    }

    console.log("added save: " + savedUserList);

    // refresh saved list
    if (selected !== "saved") getSaved();
  }

  //   sends a friend request
  async function handleFriendRequest(status, reciever) {
    // status may be : "send" "accept" "deny" "remove"

    const sender_id = data.id;
    const reciever_id = reciever;

    if (status === "send") {
      const response = await axios.post("/request", {
        fk_sender_id: sender_id,
        fk_receiver_id: reciever_id,
      });

      console.log(response);
      if (response) {
        // add user to sentList for quicker/easier referencing
        let tempList = sentList;
        tempList.push(reciever_id);
        setSentList(tempList);

        getFriends();
      } else {
        console.log("could not send");
      }
    } else if (status === "accept") {
      //   remove the pending req
      const resdel = await axios.delete(
        `/deleteRequest/${reciever_id}/${sender_id}`
      );

      // insert into /friends
      const res1 = await axios.post("/friend", {
        fk_user_id: sender_id,
        fk_friend_id: reciever_id,
      });

      //   swap here and insert

      const res2 = await axios.post("/friend", {
        fk_user_id: reciever_id,
        fk_friend_id: sender_id,
      });

      // refresh pending and friends
      getFriends();
      getPending();
    } else if (status === "deny") {
      //   remove the pending req
      const resdel = await axios.delete(
        `/deleteRequest/${reciever_id}/${sender_id}`
      );

      //   refresh pending list
      getPending();
    } else if (status === "remove") {
      const del1 = await axios.delete(
        `/deleteFriends/${sender_id}/${reciever_id}`
      );

      // refresh friends and friends list
      getFriends();
    }
  }

  return (
    <div className="page">
      <div className="sources">
        <div className="sub-navbar">
          <div></div>

          <div style={{ width: "800px" }}>
            <form id="search_form" onSubmit={handleUserSearch}>
              <button
                type="submit"
                id="search_button"
                disabled={
                  selected === "saved" || selected === "friends" ? true : false
                }
              >
                {selected === "saved" || selected === "friends" ? (
                  <svg
                    id="filter_icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                  </svg>
                ) : (
                  <svg
                    id="search_icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                )}
              </button>

              {selected === "saved" || selected === "friends" ? (
                <input
                  type="text"
                  name="searchbar"
                  placeholder="Filter"
                  id="search_bar"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  name="searchbar"
                  placeholder={
                    selected === "folders"
                      ? "Folders is disabled"
                      : 'Search "all" to get every user'
                  }
                  id="search_bar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              )}
            </form>

            <div className="selection">
              <div
                className={
                  selected === "users" ? "selected" : "selection-content"
                }
                onClick={() => handleSetSelected("users")}
              >
                Users
              </div>

              <div
                className={
                  selected === "folders" ? "selected" : "selection-content"
                }
                onClick={() => handleSetSelected("folders")}
              >
                Folders
              </div>

              <div
                className={
                  selected === "saved" ? "selected" : "selection-content"
                }
                onClick={() => handleSetSelected("saved")}
              >
                Saved
              </div>

              <div
                className={
                  selected === "friends" ? "selected" : "selection-content"
                }
                onClick={() => handleSetSelected("friends")}
              >
                Friends
              </div>
            </div>

            {/* 
                                display another sub-nav depending on the 
                                top selection state
                            */}

            {selected === "friends" ? (
              <div className="selection nested">
                <div
                  className={
                    friends === "all" ? "nested-selected" : "nested-content"
                  }
                  onClick={() => handleSetFriends("all")}
                >
                  All
                </div>

                <div
                  className={
                    friends === "pending" ? "nested-selected" : "nested-content"
                  }
                  onClick={() => handleSetFriends("pending")}
                >
                  Pending
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          <div></div>
        </div>

        {/* 
                    render results here upon form submission.
                    results will be its own stack of returned
                    content from backend / database

                    divide results based on current selection.
                 */}

        <div className="sources-results">
          {selected === "users" && (
            <Users
              data={data}
              loadUsers={loadUsers}
              handleFriendRequest={handleFriendRequest}
              sentList={sentList}
              friendsList={friendsList}
              savedUserList={savedUserList}
              insertSaved={insertSaved}
              removeSaved={removeSaved}
              pendingList={pendingList}
            />
          )}

          {selected === "friends" && friends === "all" && (
            <FriendsAll
              loadFriends={loadFriends}
              handleFilter={handleFilterSearch}
              filter={filter}
              loading={loading}
              savedUserList={savedUserList}
              insertSaved={insertSaved}
              removeSaved={removeSaved}
              handleFriendRequest={handleFriendRequest}
            />
          )}

          {selected === "friends" && friends === "pending" && (
            <FriendsPending
              loadPending={loadPending}
              handleFilter={handleFilterSearch}
              filter={filter}
              loading={loading}
              handleFriendRequest={handleFriendRequest}
              savedUserList={savedUserList}
              insertSaved={insertSaved}
              removeSaved={removeSaved}
            />
          )}

          {selected === "saved" && (
            <SavedAll
              data={data}
              loadSaved={loadSaved}
              handleFilter={handleFilterSearch}
              filter={filter}
              loading={loading}
              handleFriendRequest={handleFriendRequest}
              sentList={sentList}
              friendsList={friendsList}
              savedUserList={savedUserList}
              insertSaved={insertSaved}
              removeSaved={removeSaved}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sources;
