import React, { useEffect, useState, useContext, useRef } from "react";
import jwt_decode from "jwt-decode";
import "../styles/chat.css";
import SendChat from "./SendChat";
import AppContext from "../context/userContext";
import fetchData from "../helper/apiCall";
import { AiFillSetting } from "react-icons/ai";
import GroupChatModal from "./GroupChatModal";
import io from "socket.io-client";

const Chat = () => {
  const { currentChat, loading, setLoading } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const { id } = jwt_decode(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [newmsg, setNewmsg] = useState({});
  let socket = useRef();

  const getAllMessages = async () => {
    setLoading(true);
    const data = await fetchData(
      `/message/getallmessages/${id}/${currentChat._id}`
    );

    setMessages(data);
    socket.current.emit("join-chat", currentChat._id);
    setLoading(false);
  };

  useEffect(() => {
    if (currentChat._id) {
      getAllMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    socket.current?.on("message-recieved", (newMessage) => {
      setMessages([...messages, newMessage.data]);
    });
  });

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_ENDPOINT);
    socket.current.emit("setup", id);
  }, []);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scroll = useRef();

  const fetchUser = async () => {
    const otheruser = currentChat.users.filter((user) => user._id !== id)[0];
    setUserInfo(otheruser);
  };

  useEffect(() => {
    if (currentChat._id) {
      fetchUser();
    }
  }, [currentChat]);

  if (loading) return <h2 className="flex-center loading">Loading...</h2>;

  if (!currentChat._id)
    return (
      <section className="chat">
        <h2
          className="flex-center"
          style={{ height: "100%" }}
        >
          Click on a chat to view messages
        </h2>
      </section>
    );

  return (
    <section className="chat">
      <div className="chat__top">
        <h2 className="chat__name">
          {currentChat.isGroupChat ? currentChat.chatName : userInfo.name}
        </h2>
        {currentChat.isGroupChat && (
          <AiFillSetting
            className="gear-icon"
            onClick={() => {
              setModalOpen(true);
            }}
          />
        )}
      </div>
      <GroupChatModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        type={"update"}
        groupname={currentChat.chatName}
        group={currentChat}
      />
      <div className="chat__box">
        {messages.map((ele, i) => {
          return ele.senderId === id ? (
            <div
              className="single-chat own__chat"
              key={i}
              ref={scroll}
            >
              <div className="single-chat__content flex-center">
                <p>{ele.content}</p>
              </div>
              <div className="single-chat__pic flex-center">
                <img
                  src={
                    ele.senderPic ||
                    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                  }
                  alt="pic"
                />
              </div>
            </div>
          ) : (
            <div
              className="single-chat"
              key={i}
              ref={scroll}
            >
              <div className="single-chat__pic flex-center">
                <img
                  src={
                    ele.senderPic ||
                    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                  }
                  alt="pic"
                />
              </div>
              <div className="single-chat__content flex-center">
                <p>{ele.content}</p>
              </div>
            </div>
          );
        })}
      </div>
      <SendChat
        socket={socket}
        setMessages={setMessages}
        messages={messages}
        setNewmsg={setNewmsg}
      />
    </section>
  );
};

export default Chat;
