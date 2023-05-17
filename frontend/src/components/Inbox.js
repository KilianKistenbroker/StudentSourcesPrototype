import { useState } from "react";
import handleUserSearch from "../helpers/handleUserSearch";
import axios from "../api/axios";
import { useEffect } from "react";

const Inbox = ({ data }) => {
  // options will either be 'create dm' or the most recent conversation
  const [selection, setSelection] = useState("conversations");
  const [textMessage, setTextMessage] = useState("");

  const [groups, setGroups] = useState([]);
  const [currentGroupChat, setCurrentGroupChat] = useState(0);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [searchSelection, setSearchSelection] = useState("All");
  const [loadUsers, setLoadUsers] = useState(null);

  const [chatPoolId, setChatPoolId] = useState([]);
  const [chatPoolUser, setChatPoolUser] = useState([]);
  const [messageData, setMessageData] = useState([]);

  useEffect(() => {
    // get groupchats here from backend
    getGroups();
  }, []);

  useEffect(() => {
    getMessages();
    setTextMessage("");
  }, [groups, currentGroupChat]);

  const getMessages = async () => {
    if (groups.length === 0) return;
    const group_id = groups[currentGroupChat].id;
    try {
      if (groups.length > 0) {
        const res = await axios.get(`/getMessages/${group_id}`);
        setMessageData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGroups = async () => {
    try {
      const res = await axios.get(`/getGroups/${data.id}`);
      setGroups(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLeaveGroup = async () => {
    const group_id = groups[currentGroupChat].id;
    let tempGroups = groups.slice();
    let newGroupPool = [];

    for (let i = 0; i < tempGroups.length; i++) {
      if (tempGroups[i].id !== group_id) {
        newGroupPool.push(tempGroups[i]);
      }
    }
    setCurrentGroupChat(0);
    setGroups(newGroupPool);

    try {
      const res = await axios.delete(`/leaveGroupChat/${group_id}/${data.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteGroup = async () => {
    const group_id = groups[currentGroupChat].id;
    let tempGroups = groups.slice();
    let newGroupPool = [];

    for (let i = 0; i < tempGroups.length; i++) {
      if (tempGroups[i].id !== group_id) {
        newGroupPool.push(tempGroups[i]);
      }
    }

    setCurrentGroupChat(0);
    setGroups(newGroupPool);
    try {
      const res = await axios.delete(`/deleteGroup/${group_id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetChatPool = (state, loadData) => {
    let chatPoolCopyId = chatPoolId.slice();
    let chatPoolCopyUser = chatPoolUser.slice();

    if (state === "add") {
      chatPoolCopyId.push(loadData.id);
      chatPoolCopyUser.push(loadData.user);
      setChatPoolId(chatPoolCopyId);
      setChatPoolUser(chatPoolCopyUser);
    } else {
      let tempIds = [];
      let tempUsers = [];

      for (let i = 0; i < chatPoolCopyId.length; i++) {
        if (chatPoolCopyId[i] !== loadData.id) {
          tempIds.push(chatPoolCopyId[i]);
        }
      }
      setChatPoolId(tempIds);

      for (let i = 0; i < chatPoolCopyUser.length; i++) {
        if (chatPoolCopyUser[i] !== loadData.user) {
          tempUsers.push(chatPoolCopyId[i]);
        }
      }
      setChatPoolUser(tempUsers);
    }
  };

  const handleCreateChat = async (e) => {
    e.preventDefault();
    try {
      // const res = await axios.post(
      //   "/createGroupChat",
      //   {
      //     fk_owner_id: data.id,
      //   },
      //   chatPool
      // );

      // adding owner to pool
      let adjustedPoolId = chatPoolId.slice();
      let adjustedPoolUser = chatPoolUser.slice();

      adjustedPoolId.push(data.id);
      adjustedPoolUser.push(data.user);

      const groupName = adjustedPoolUser.join(", ").slice(0, 20);
      const res = await axios.post(
        "/createGroupChat",
        {
          fk_owner_id: data.id,
        },
        {
          params: {
            user_ids: adjustedPoolId.join(","),
          },
        }
      );

      setChatPoolId([]);
      setChatPoolUser([]);

      // temp set groups
      let copyGroups = groups.slice();
      copyGroups.push({
        id: res.data.id,
        groupName: groupName,
        totalMembers: adjustedPoolId.length,
      });

      setGroups(copyGroups);
    } catch (error) {
      console.log(error);
      setChatPoolId([]);
    }
  };

  // ------------------ taken from student.js --------------- //
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = monthNames[monthIndex];

    return `${day} ${month} ${year}`;
  }

  const addMessage = async () => {
    //TODO: Instead of manipulating local data, use api's
    const group_id = groups[currentGroupChat].id;
    const messageCopy = messageData.slice();
    const tempCommentInsert = {
      user: data.user,
      message: textMessage,
      date_posted: formatDate(new Date()),
    };
    messageCopy.push(tempCommentInsert);
    setMessageData(messageCopy);

    try {
      let adjustedMessageData = {};

      adjustedMessageData = {
        message: textMessage,
        fk_group_id: group_id,
        fk_user_id: data.id,
      };

      const res = await axios.post("/createDirectMessage", adjustedMessageData);
    } catch (error) {
      console.log(error);
    }
    setTextMessage("");
  };

  const addToConversation = () => {
    //TODO: Instead of manipulating local data, use api's
    if (textMessage.trim(" ").length === 0) return;
    else {
      const tempCopy = messageData.slice();
      tempCopy.push({
        commenterImage: "http://placekitten.com/50/50", // replace with avatar from db
        username: data.user,
        commentText: textMessage,
        date: formatDate(new Date()),
      });
      setMessageData(tempCopy);
      setTextMessage("");
    }
  };

  const messageItems = messageData.map((textMessage, index) => (
    <li
      key={index}
      style={
        textMessage.user === data.user ? { backgroundColor: "#ededed" } : {}
      }
    >
      {/* <img src={comment.commenterImage} /> */}
      <div className="box-icon"></div>

      <div
        className="commentText"
        style={{ paddingLeft: "10px", paddingRight: "10px" }}
      >
        <p className="">
          {" "}
          <a className="commenterUsername link">{textMessage.user}</a>
          <br />
          {textMessage.message}
        </p>{" "}
        <span className="date sub-text">{textMessage.date_posted}</span>
      </div>
    </li>
  ));

  return (
    <div className="inbox-container">
      <div className="left-inbox">
        <div className="inbox-create-dm">
          Create DM
          <svg
            onClick={() => {
              setSelection("create-dm");
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="header-icons cursor-enabled"
            style={{ width: "18px", height: "18px", float: "right" }}
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </div>

        {/* map through friends list for now, but will prob have a seperate dm table to store conversations */}

        <div className="left-inbox-contacts">
          {groups.length > 0 &&
            groups.map((loadGroups, index) => (
              <div
                className="inbox-contact cursor-enabled"
                onClick={() => {
                  setCurrentGroupChat(index);
                  setSelection("conversations");
                }}
                key={index}
                style={
                  currentGroupChat === index && selection !== "create-dm"
                    ? { backgroundColor: "#ececec" }
                    : {}
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="user-nav-icon"
                  fill="currentColor"
                  style={{ height: "35px", width: "35px", marginRight: "10px" }}
                  viewBox="0 0 16 16"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
                <div className="inbox-username">
                  <div>{loadGroups.groupName}</div>
                  <div style={{ fontSize: "14px", color: "#aaa" }}>
                    members: {loadGroups.totalMembers}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="right-inbox">
        {/* This a hotfix hacky wacky trick to fix css alignment issues */}
        <div style={{ width: "450px" }}>{}</div>

        {/* conversation body */}
        {selection === "create-dm" || groups.length === 0 ? (
          <div>
            <div className="inbox-search">
              <form
                id="search_form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserSearch(e, setLoadUsers, search, () => {});
                }}
              >
                <button type="submit" id="search_button">
                  <svg
                    id="search_icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </button>

                <input
                  type="text"
                  name="searchbar"
                  placeholder={"Search Users"}
                  id="search_bar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoComplete="off"
                />
              </form>
            </div>
            <div
              style={{
                marginTop: "45px",
                padding: "15px",
                fontSize: "15px",
                width: "100%",
                color: "#3d3d3d",
              }}
            >
              {!loadUsers && (
                <div>
                  <b>Hint: </b>Find a user to start a conversation with.
                </div>
              )}
              {/* display results */}
              {loadUsers &&
                loadUsers
                  .filter(function (loadData) {
                    return loadData.user !== data.user;
                  })
                  .map((loadData, index) => (
                    <div className="box box-hover" key={index}>
                      <div className="user-grid">
                        <div className="box-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          </svg>
                        </div>

                        <div className="box-username">
                          @{loadData.user} <br />
                          {loadData.firstName} {loadData.lastName}
                        </div>
                      </div>

                      <div></div>

                      <div className="box-friend">
                        {chatPoolId.includes(loadData.id) ? (
                          <div
                            className="box-friend-content cursor-enabled sent"
                            onClick={() =>
                              handleSetChatPool("remove", loadData)
                            }
                          >
                            Added
                          </div>
                        ) : (
                          <div
                            className="box-friend-content cursor-enabled"
                            onClick={() => handleSetChatPool("add", loadData)}
                          >
                            Add to chat
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
            </div>

            <div className="inbox-textarea">
              <button
                className="create-group-chat"
                type="button"
                onClick={handleCreateChat}
                disabled={chatPoolId.length === 0}
                style={{ transition: "none" }}
              >
                Create group chat
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="inbox-search">
              <form
                id="search_form"
                onSubmit={(e) => {
                  e.preventDefault();
                  // handleUserSearch(e, setLoadUsers, search, () => {});
                }}
              >
                {groups[currentGroupChat].fk_owner_id === data.id ? (
                  <button
                    className="create-group-chat"
                    type="button"
                    style={{
                      padding: "5px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      transition: "none",
                    }}
                    onClick={handleDeleteGroup}
                  >
                    Delete group chat
                  </button>
                ) : (
                  <button
                    className="create-group-chat"
                    type="button"
                    style={{
                      padding: "5px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      transition: "none",
                    }}
                    onClick={handleLeaveGroup}
                  >
                    Leave group chat
                  </button>
                )}
              </form>
            </div>
            <div
              className="right-panel-coments"
              style={{ height: "423px", overflowX: "scroll" }}
            >
              <div className="commentsContainer" id="comment">
                <ul className="commentList">{messageItems}</ul>
              </div>
            </div>

            <div className="inbox-textarea">
              <form
                className="form-inline"
                onSubmit={(e) => {
                  e.preventDefault();
                  addMessage();
                }}
              >
                <input
                  className="comment-input"
                  type="text"
                  value={textMessage}
                  // temp username
                  placeholder={`Message @${groups[currentGroupChat].groupName}`}
                  onChange={(e) => setTextMessage(e.target.value)}
                />
                <button
                  className="comment-send-button"
                  type="button"
                  // onClick={addMessage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="header-icons"
                    style={{ width: "20px", height: "20px", marginTop: "10px" }}
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
