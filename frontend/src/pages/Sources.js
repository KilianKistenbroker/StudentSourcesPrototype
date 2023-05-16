import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import FriendsAll from "../components/FriendsAll";
import FriendsPending from "../components/FriendsPending";
import SavedAll from "../components/SavedAll";
import Users from "../components/Users";
import dummyFolder from "../data/dummyFolder";
import Student from "./Student";
import Window from "../components/Window";
import retrieveOutsideJson from "../helpers/retrieveOutsideJson";

const Sources = ({ data, windowDimension, message, setMessage }) => {
  const navigate = useNavigate();

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

  const [explorerData, setExplorerData] = useState(null);
  const [currentDirectory, setCurrentDirectory] = useState(null);
  const [owner, setOwner] = useState(null);

  // -------- call essential getters here on re-render ----------
  useEffect(() => {
    if (data.id < 0) {
      data.currentPoint = "login";
      window.scrollTo(0, 0);
      navigate("/login");
      return;
    }

    getFriends();
    getPending();
    getSaved();
  }, []);

  const getUsersPage = (user) => {
    // fetch users folder from efs
    setOwner(user);
    retrieveOutsideJson(user.id).then((res) => {
      console.log(res);
      setExplorerData(res);
      setCurrentDirectory(res);
    });
  };

  const getFriends = async (e) => {
    const res = await axios.get(`/findFriends/${data.id}`);

    let temp = [];
    for (let i = 0; i < res.data.length; i++) {
      temp.push(res.data[i].id);
    }
    setLoadFriends(res.data);
    setFriendsList(temp);
  };

  /* these functions will set selected to friends, 
and also call request to update lists */

  const handleSetFriends = (selected) => {
    getFriends();
    setSelected("friends");
    setFriends(selected);
  };

  const handleSetSelected = (select) => {
    if (selected === "saved") getSaved();
    else if (selected === "friends") getFriends();
    setSelected(select);
  };

  const handleUserSearch = async (e) => {
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
    const res = await axios.get(`/mySavedUsers/${data.id}`);
    let tempSaveUserList = [];

    for (let i = 0; i < res.data.length; i++) {
      tempSaveUserList.push(res.data[i].id);
    }

    setLoadSaved(res.data);
    setSavedUserList(tempSaveUserList);
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

      // refresh friends
      getFriends();
    }
  }

  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  if (explorerData && owner) {
    return (
      <Student
        data={data}
        windowDimension={windowDimension}
        owner={owner}
        setOwner={setOwner}
        explorerData={explorerData}
        setExplorerData={setExplorerData}
        message={message}
        setMessage={setMessage}
        currentDirectory={currentDirectory}
        setCurrentDirectory={setCurrentDirectory}
      />
    );
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
                  placeholder={
                    selected === "saved" ? "Filter Bookmarks" : "Filter Friends"
                  }
                  id="search_bar"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  autoComplete="off"
                />
              ) : (
                <input
                  type="text"
                  name="searchbar"
                  placeholder={
                    selected === "folders" ? "Search Folders" : "Search Users"
                  }
                  id="search_bar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoComplete="off"
                  // ------------- TO BE IMPLEMENTED ~ Searing for Folders ----------- //

                  onFocus={
                    selected === "folders"
                      ? () =>
                          setMessage({
                            title: "Searching for Folders",
                            body: "This feature shall provide users the ability to search for publicly available folders across the SS database.",
                          })
                      : () => {}
                  }
                  onBlur={
                    selected === "folders"
                      ? () =>
                          setMessage({
                            title: null,
                            body: null,
                          })
                      : () => {}
                  }
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
                {/* Users */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="header-icons"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                </svg>
              </div>

              <div
                className={
                  selected === "folders" ? "selected" : "selection-content"
                }
                onClick={() => handleSetSelected("folders")}
              >
                {/* Folders */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="header-icons"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z" />
                </svg>
              </div>

              <div
                className={
                  selected === "saved" ? "selected" : "selection-content"
                }
                onClick={() => handleSetSelected("saved")}
              >
                {/* Saved */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="header-icons"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                </svg>
              </div>

              <div
                className={
                  selected === "friends" ? "selected" : "selection-content"
                }
                onClick={() => handleSetSelected("friends")}
              >
                {/* Friends */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="header-icons"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                </svg>
              </div>
            </div>

            {/* 
                                display another sub-nav depending on the 
                                top selection state
                            */}
          </div>

          <div></div>
        </div>

        <div
          style={{
            marginTop: "190px",
            justifySelf: "center",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          {selected === "friends" && (
            <div className="selection nested" style={{ marginBottom: "-50px" }}>
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
          )}
        </div>

        {/* 
                    render results here upon form submission.
                    results will be its own stack of returned
                    content from backend / database

                    divide results based on current selection.
                 */}

        <div className="sources-results">
          <Window message={message} setMessage={setMessage} />

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
              getUsersPage={getUsersPage}
            />
          )}

          {selected === "friends" && friends === "all" && (
            <FriendsAll
              loadFriends={loadFriends}
              handleFilter={handleFilterSearch}
              filter={filter}
              savedUserList={savedUserList}
              insertSaved={insertSaved}
              removeSaved={removeSaved}
              handleFriendRequest={handleFriendRequest}
              getUsersPage={getUsersPage}
            />
          )}

          {selected === "friends" && friends === "pending" && (
            <FriendsPending
              loadPending={loadPending}
              handleFilter={handleFilterSearch}
              filter={filter}
              handleFriendRequest={handleFriendRequest}
              savedUserList={savedUserList}
              insertSaved={insertSaved}
              removeSaved={removeSaved}
              getUsersPage={getUsersPage}
            />
          )}

          {selected === "saved" && (
            <SavedAll
              data={data}
              loadSaved={loadSaved}
              handleFilter={handleFilterSearch}
              filter={filter}
              handleFriendRequest={handleFriendRequest}
              sentList={sentList}
              friendsList={friendsList}
              savedUserList={savedUserList}
              insertSaved={insertSaved}
              removeSaved={removeSaved}
              pendingList={pendingList}
              getUsersPage={getUsersPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sources;
