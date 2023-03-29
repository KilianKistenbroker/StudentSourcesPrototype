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

  //   // these are loaded immediately on login / refresh
  const [loadFriends, setLoadFriends] = useState([]);
  const [friendsList, setFriendsList] = useState([]); // all users in friends list by id

  const [sentList, setSentList] = useState([]); // all users in friends list by id
  const [savedUserList, setSavedUserList] = useState([]); // all saved users by id
  const [pendingList, setPendingList] = useState([]); // all saved pending friend reqs by user id

  const [loadPending, setLoadPending] = useState([]);
  const [loadSaved, setLoadSaved] = useState([]);

  // these are loaded after submitting a search query
  const [loadUsers, setLoadUsers] = useState([]);
  const [loadFolders, setLoadFolders] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // temp display bools for showing feedback w/o forcing re-render
  const [tempSentKey, setSentTempKey] = useState(-1);
  const [tempSaveKey, setSaveTempKey] = useState(-1);
  //   const [tempRemovedIndex, setTemp]
  const [saved, setSaved] = useState(false);
  const [sent, setSent] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // -------- call inexpensive init getters here on re-render ----------
  useEffect(() => {
    if (!data.isLoggedIn) {
      data.currentPoint = "login";
      navigate("/login");
      return;
    }

    // getFriendsList();
    getFriends();
    getPending();
    getSaved();

    setLoading(false);
  }, []);

  /*
   * NOTE: generally speaking, the only things i need from backend
   * is a list of objects containing with attributes 'username',
   * 'firstName', and 'lastName' in order to render them.
   */

  const getFriends = async (e) => {
    setLoading(true);

    const res = await axios.get(`/findFriends/${data.id}`);

    // const res = await axios.get(`/friends/?user_id=${data.id}`);

    // ----------- this part it probably done in backend (will delete later) ------------

    let gatheringFriends = []; // this will contain friend objects
    let friendsList = []; // this will contain an array of ids

    for (let i = 0; i < res.data.length; i++) {
      let tempObject = await axios.get(`/users/?id=${res.data[i].friend_id}`);
      let friendObject = {
        user: "",
        firstName: "",
        lastName: "",
        id: -1,
      };

      friendObject.user = tempObject.data[0].user;
      friendObject.firstName = tempObject.data[0].firstName;
      friendObject.lastName = tempObject.data[0].lastName;
      friendObject.id = tempObject.data[0].id;
      friendsList.push(tempObject.data[0].id);
      gatheringFriends.push(friendObject);
    }
    // ----------- end of backend part ------------

    setLoadFriends(gatheringFriends);
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
    // testing dynamic rendering. this will not be used for search
    e.preventDefault();

    getFriends();

    let str2 = search.toLowerCase();
    str2 = str2.replace(/ +/g, "");

    if (str2 === "all") {
      const res = await axios.get("/users");
      setLoadUsers(res.data);
      console.log(res.data);
    } else {
      /*
       * NOTE:
       * this solution is a very strict search. The backend will
       * probably have to manipulate the search string to return
       * a margin of close results.
       */

      const res = await axios.get(`/users/?user=${search}`);
      setLoadUsers(res.data);
      console.log(res.data);
    }
  };

  //   search through and get all of logged in users friends and pending requests
  const handleFilterSearch = (filter, item) => {
    // this can probably be done on the frontend since friends are immediately loaded here

    const str1 =
      item.user.toLowerCase() +
      item.firstName.toLowerCase() +
      item.lastName.toLowerCase();
    let str2 = filter.toLowerCase();
    str2 = str2.replace(/ +/g, "");

    if (filter.length == 0) return true;

    if (str1.includes(str2)) return true;
    return false;
  };

  //   gets all of users pending friend requests
  const getPending = async () => {
    // get sent requests here

    const senderRes = await axios.get(`/requests/?sender_id=${data.id}`);
    const recieverRes = await axios.get(`/requests/?reciever_id=${data.id}`);

    let tempSenderList = [];
    let tempPending = [];
    let tempPendingList = [];

    for (let i = 0; i < senderRes.data.length; i++) {
      tempSenderList.push(senderRes.data[i].reciever_id);
    }

    for (let i = 0; i < recieverRes.data.length; i++) {
      let tempObject = await axios.get(
        `/users/?id=${recieverRes.data[i].sender_id}`
      );
      let userObj = {
        user: "",
        firstName: "",
        lastName: "",
        id: -1,
      };

      userObj.user = tempObject.data[0].user;
      userObj.firstName = tempObject.data[0].firstName;
      userObj.lastName = tempObject.data[0].lastName;
      userObj.id = tempObject.data[0].id;
      tempPendingList.push(tempObject.data[0].id);
      tempPending.push(userObj);
    }

    setSentList(tempSenderList);

    setLoadPending(tempPending);

    setPendingList(tempPendingList);

    let pendingList = [];
    for (let i = 0; i < loadPending.length; i++) {
      pendingList.push(loadPending[i].id);
    }

    // setPendingList(pendingList);

    console.log(loadPending);

    console.log("sent list: " + sentList);
  };

  const getSavedList = async () => {};

  //   gets all of users saved items
  const getSaved = async () => {
    setLoading(true);

    const res = await axios.get(`/saved/?user_id=${data.id}`);

    console.log("res");
    console.log(res);

    // ----------- this part it probably done in backend (will delete later) ------------

    let gatheringSaved = []; // this will contain friend objects
    let tempSaveUserList = [];

    for (let i = 0; i < res.data.length; i++) {
      if (res.data[i].isUser) {
        let tempObject = await axios.get(`/users/?id=${res.data[i].item_id}`);
        let saveObject = {
          user: "",
          firstName: "",
          lastName: "",
          id: -1,
        };

        saveObject.user = tempObject.data[0].user;
        saveObject.firstName = tempObject.data[0].firstName;
        saveObject.lastName = tempObject.data[0].lastName;
        saveObject.id = tempObject.data[0].id;
        tempSaveUserList.push(tempObject.data[0].id);

        gatheringSaved.push(saveObject);
      } else {
        // get folders here
      }
    }
    // ----------- end of backend part ------------

    setLoadSaved(gatheringSaved);
    setSavedUserList(tempSaveUserList);

    setLoading(false);
  };

  async function removeSaved(isUser, item_id, index) {
    // setRemoveInProg(true);

    const getRes = await axios.get(
      `/saved/?item_id=${item_id}&isUser=${isUser}&user_id=${data.id}`
    );

    console.log("get res");
    console.log(getRes);

    if (getRes.data.length > 0) {
      const delRes = await axios.delete(`/saved/${getRes.data[0].id}`);
    }

    console.log("index remove: " + index);

    setSaveTempKey(index);
    setSaved(false);
    // setRemoveInProg(false);

    if (isUser) {
      let tempList1 = [];
      for (let i = 0; i < savedUserList.length; i++) {
        if (savedUserList[i] != item_id) tempList1.push(savedUserList[i]);
      }
      setSavedUserList(tempList1);
    } else {
      // adding to folder list here
    }

    console.log("removed save: " + savedUserList);

    // refresh saved list
    if (selected !== "saved") getSaved();
  }

  async function insertSaved(isUser, item_id, index) {
    console.log("index insert: " + index);
    // insert user into this user's saved items list.
    const user_id = data.id;
    const response = await axios.post(
      "/saved",
      JSON.stringify({
        user_id,
        item_id,
        isUser,
      }),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    setSaved(true);
    setSaveTempKey(index);

    console.log("instered save i think");

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
    // status : "send" "accept" "deny" "remove"
    setSent(true);
    setSentTempKey(reciever - 1);

    console.log(sent);

    const sender_id = data.id;
    const reciever_id = reciever;

    if (status === "send") {
      // check if req already exists from other end
      // accept friend req if it does exist
      // otherwise, post new friend req here
      //   this should be done in backend

      const response = await axios.post(
        "/requests",
        JSON.stringify({
          sender_id,
          reciever_id,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(response);
      if (response) {
        // add user to sentList
        let tempList = sentList;
        tempList.push(reciever_id);
        setSentList(tempList);

        // ??? this works ???
        getFriends(); // this will trigger sent message somehow???
        // ???????????????????????
      } else {
        console.log("could not send");
      }
    } else if (status === "accept") {
      // handled in backend

      //   remove the pending req
      const res0 = await axios.get(`/requests/?reciever_id=${sender_id}`);
      if (res0.data.length === 0) return console.log("bad get req");
      const resdel = await axios.delete(`/requests/${res0.data[0].id}`);
      if (resdel.data.length === 0) return console.log("bad delete req");

      // insert into /friends
      const res1 = await axios.post(
        "/friends",
        JSON.stringify({
          user_id: sender_id,
          friend_id: reciever_id,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      //   swap here and insert

      const res2 = await axios.post(
        "/friends",
        JSON.stringify({
          user_id: reciever_id,
          friend_id: sender_id,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // refresh pending and friends
      getFriends();
      getPending();
    } else if (status === "deny") {
      // handled in backend

      //   remove the pending req
      const res0 = await axios.get(`/requests/?reciever_id=${sender_id}`);
      if (res0.data.length === 0) return console.log("bad get req");
      const resdel = await axios.delete(`/requests/${res0.data[0].id}`);
      if (resdel.data.length === 0) return console.log("bad delete req");

      //   refresh pending list
      getPending();
    } else if (status === "remove") {
      // handled in backend
      //   remove friend

      // make 6 requests to backend database lol.
      const res1 = await axios.get(
        `/friends/?user_id=${sender_id}&friend_id=${reciever_id}`
      );
      const res2 = await axios.get(
        `/friends/?user_id=${reciever_id}&friend_id=${sender_id}`
      );

      const del1 = await axios.delete(`/friends/${res1.data[0].id}`);
      const del2 = await axios.delete(`/friends/${res2.data[0].id}`);

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
              //   sent={sent}
              tempSentKey={tempSentKey}
              sentList={sentList}
              friendsList={friendsList}
              savedUserList={savedUserList}
              insertSaved={insertSaved}
              //   saved={saved}
              tempSaveKey={tempSaveKey}
              saved={saved}
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
              tempSentKey={tempSentKey}
              sentList={sentList}
              friendsList={friendsList}
              savedUserList={savedUserList}
              insertSaved={insertSaved}
              tempSaveKey={tempSaveKey}
              saved={saved}
              removeSaved={removeSaved}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sources;
