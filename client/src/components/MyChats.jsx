import React, { useContext, useEffect, useState } from "react";
import "../styles/mychats.css";
import UserCard from "./UserCard";
import jwt_decode from "jwt-decode";
import { AiOutlinePlus } from "react-icons/ai";
import GroupChatModal from "./GroupChatModal";
import fetchData from "../helper/apiCall";
import AppContext from "../context/userContext";

const MyChats = () => {
  const { id } = jwt_decode(localStorage.getItem("token"));
  const [myChats, setMyChats] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { setCurrentChat, loading } = useContext(AppContext);

  const fetchAllChats = async () => {
    const data = await fetchData(`/chat/getchats/${id}`);
    setMyChats(data);
  };

  useEffect(() => {
    fetchAllChats();
  }, [loading]);

  const clickFunc = (other) => {
    setCurrentChat(other);
  };

  // if (loading) return <h2 className="flex-center loading">Loading...</h2>;

  return (
    <section className="mychats">
      <div className="mychats-top">
        <h2 className="mychats__heading">My Chats</h2>
        <div
          className="create-group"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          <span>Create group chat</span>
          <AiOutlinePlus className="plus__icon" />
        </div>
      </div>
      <div className="allusers">
        {myChats.map((ele) => {
          return (
            <UserCard
              ele={ele}
              key={ele._id}
              clickFunc={clickFunc}
              imgClass={"mychats-img"}
            />
          );
        })}
      </div>
      <GroupChatModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        type={"create"}
        myChats={myChats}
        setMyChats={setMyChats}
      />
    </section>
  );
};

export default MyChats;
