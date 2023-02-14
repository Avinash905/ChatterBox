import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import fetchData from "../helper/apiCall";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import jwt_decode from "jwt-decode";
import axios from "axios";

const GroupChatModal = ({
  modalOpen,
  setModalOpen,
  type,
  group,
  setMyChats,
  myChats,
}) => {
  const { id } = jwt_decode(localStorage.getItem("token"));
  const [groupName, setGroupName] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [presentUsers, setPresentUsers] = useState([]);

  const fetchUsers = async () => {
    let arr = [];
    for (let index = 0; index < group.users.length; index++) {
      if (group.users[index]._id !== id) {
        arr.push(group.users[index]);
      }
    }
    setPresentUsers(arr);
  };

  useEffect(() => {
    if (group?._id) {
      fetchUsers();
    }
  }, [group]);

  const onInputChange = async (search) => {
    setSearchInput(search);
    const data = await fetchData(`/user/searchuser/${id}?search=${search}`);
    setSearchedUsers(data);
  };

  const removeUser = (userid) => {
    setSelectedUsers(selectedUsers.filter((ele) => ele._id !== userid));
  };

  const selectuser = (newuser) => {
    const found = selectedUsers.find((el) => el._id === newuser._id);

    if (found) {
      return toast.error("User already selected");
    }
    setSelectedUsers([...selectedUsers, newuser]);
  };

  const createNewGroup = async () => {
    try {
      if (selectedUsers.length < 2) {
        return toast.error("Select at least 2 users");
      }
      if (!groupName) {
        return toast.error("Group name must be provided");
      }

      const users = selectedUsers.map((ele) => {
        return ele._id;
      });

      const { data } = await toast.promise(
        axios.post(
          `/chat/creategroup/${id}`,
          {
            chatName: groupName,
            users,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Creating group...",
          success: "Group created successfully",
          error: "Unable to create group",
          loading: "Creating group...",
        }
      );
      setSelectedUsers([]);
      setGroupName("");
      setModalOpen(false);
      setSearchInput("");
      setMyChats([...myChats, data]);
    } catch (error) {
      return error;
    }
  };

  const addToGroup = async (ele) => {
    try {
      if (id !== group.groupAdmin) {
        return toast.error("Only admins can add users");
      }

      let found = false;
      presentUsers.forEach((user) => {
        if (ele._id === user._id) {
          found = true;
        }
      });

      if (found) {
        return toast.error("User already exists");
      }

      const { data } = await toast.promise(
        axios.put(
          `/chat/addtogroup/${id}`,
          {
            chatId: group._id,
            userId: ele._id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Adding user to group...",
          success: "User added to group",
          error: "Unable to add user to group",
          loading: "Adding user to  group...",
        }
      );

      const userData = await fetchData(`/user/getuser/${id}/${ele._id}`);
      setPresentUsers([...presentUsers, userData]);
    } catch (error) {
      return error;
    }
  };

  const renameGroup = async () => {
    try {
      if (id !== group.groupAdmin) {
        return toast.error("Only admins can change group name");
      }

      if (!groupName) {
        return toast.error("Group name must be provided");
      }

      const { data } = await toast.promise(
        axios.put(
          `/chat/renamegroup/${id}`,
          {
            chatName: groupName,
            chatId: group._id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Renaming group...",
          success: "Group renamed successfully",
          error: "Unable to rename group",
          loading: "Renaming group...",
        }
      );
      setGroupName("");
    } catch (error) {
      return error;
    }
  };

  const removeFromGroup = async (userId) => {
    try {
      if (id !== group.groupAdmin) {
        return toast.error("Only admins can remove user");
      }

      if (presentUsers.length <= 2) {
        return toast.error("Select at least 2 users");
      }

      await toast.promise(
        axios.put(
          `/chat/removefromgroup/${id}`,
          {
            userId,
            chatId: group._id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Removing from group...",
          success: "Removed from group",
          error: "Unable to remove from group",
          loading: "Removing from group...",
        }
      );

      setPresentUsers(presentUsers.filter((ele) => ele._id !== userId));
    } catch (error) {
      return error;
    }
  };

  const createChildren = (
    <div className="create-group__modal">
      <h2>Create New Group</h2>
      <input
        type="text"
        placeholder="Group Name"
        className="form-input"
        value={groupName}
        onChange={(e) => {
          setGroupName(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Add Users"
        className="form-input"
        value={searchInput}
        onChange={(e) => {
          onInputChange(e.target.value);
        }}
      />

      <div className="selected-users">
        {selectedUsers.map((ele) => {
          return (
            <div
              className="user-pill"
              key={ele._id}
            >
              {ele.name}
              <IoMdClose
                onClick={() => {
                  removeUser(ele._id);
                }}
                className="pill-close"
              />
            </div>
          );
        })}
      </div>

      {searchedUsers.length > 0 ? (
        <div className="group-search__users">
          {searchedUsers.map((ele) => {
            return (
              <div
                className="usercard"
                key={ele._id}
                onClick={() => {
                  selectuser(ele);
                }}
              >
                <div
                  className={`usercard__image flex-center search-card__image`}
                >
                  <img
                    src={
                      ele.pic ||
                      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    }
                    alt="contact-pic"
                  />
                </div>
                <div className="usercard__info">
                  <h4 className="usercard__name">{ele.name}</h4>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );

  const updateChildren = (
    <div className="create-group__modal">
      <h2>{group?.chatName}</h2>
      <div className="name-container">
        <input
          type="text"
          placeholder="Group Name"
          className="form-input"
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
          }}
        />
        <button
          className="btn"
          onClick={renameGroup}
        >
          Update
        </button>
      </div>
      <input
        type="text"
        placeholder="Add Users"
        className="form-input"
        value={searchInput}
        onChange={(e) => {
          onInputChange(e.target.value);
        }}
      />

      <div className="selected-users">
        {presentUsers.map((ele) => {
          return (
            <div
              className="user-pill"
              key={ele._id}
            >
              {ele.name}
              <IoMdClose
                onClick={() => {
                  removeFromGroup(ele._id);
                }}
                className="pill-close"
              />
            </div>
          );
        })}
      </div>

      {searchedUsers.length > 0 ? (
        <div className="group-search__users">
          {searchedUsers.map((ele) => {
            return (
              <div
                className="usercard"
                key={ele._id}
                onClick={() => {
                  addToGroup(ele);
                }}
              >
                <div
                  className={`usercard__image flex-center search-card__image`}
                >
                  <img
                    src={
                      ele.pic ||
                      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    }
                    alt="contact-pic"
                  />
                </div>
                <div className="usercard__info">
                  <h4 className="usercard__name">{ele.name}</h4>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );

  return (
    <>
      {modalOpen && (
        <Modal
          setModalOpen={setModalOpen}
          children={type === "create" ? createChildren : updateChildren}
          handleClick={type === "create" ? createNewGroup : null}
          btnname={type === "create" ? "Create Group" : ""}
          mClass={"group-modal-width"}
        />
      )}
    </>
  );
};

export default GroupChatModal;
