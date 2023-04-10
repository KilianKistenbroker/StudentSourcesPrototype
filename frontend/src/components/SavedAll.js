import { useEffect, useState } from "react";

const SavedAll = ({
  data,
  loadSaved,
  handleFilter,
  filter,
  handleFriendRequest,
  sentList = { sentList },
  friendsList,
  savedUserList,
  insertSaved,
  removeSaved,
  pendingList,
}) => {
  const checkFriendStatus = (id) => {
    return friendsList.includes(id);
  };

  return loadSaved
    .filter(function (loadData) {
      return handleFilter(filter, loadData);
    })
    .map((loadData, index) => (
      <div className="box" key={index}>
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

        {savedUserList.includes(loadData.id) ? (
          <div
            className="box-star"
            onClick={() => removeSaved(true, loadData.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
            </svg>
          </div>
        ) : (
          <div
            className="box-star"
            onClick={() => insertSaved(true, loadData.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
              <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z" />
            </svg>
          </div>
        )}

        <div className="box-friend">
          {/* check if this user is a friend or pending */}

          {checkFriendStatus(loadData.id) ? (
            <div className="box-friend-content cursor-enabled">
              <div
                className="center"
                onClick={() => handleFriendRequest("remove", loadData.id)}
              >
                Remove <br /> friend
              </div>
            </div>
          ) : pendingList.includes(loadData.id) ? (
            <div className="box-friend-content cursor-disabled sent">
              Pending
            </div>
          ) : sentList.includes(loadData.id) ? (
            <div className="box-friend-content cursor-disabled sent">Sent</div>
          ) : data.id === loadData.id ? (
            <div className="box-friend-content cursor-disabled sent">You</div>
          ) : (
            <div
              className="box-friend-content cursor-enabled"
              onClick={() => handleFriendRequest("send", loadData.id)}
            >
              Add friend
            </div>
          )}
        </div>
      </div>
    ));
};

export default SavedAll;
