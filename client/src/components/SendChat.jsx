import React, { useContext, useState } from "react";
import jwt_decode from "jwt-decode";
import "../styles/sendchat.css";
import InputEmoji from "react-input-emoji";
import AppContext from "../context/userContext";
import axios from "axios";

const SendChat = ({ socket, setMessages, messages, setNewmsg }) => {
  const [emoji, setEmoji] = useState("");
  const { id } = jwt_decode(localStorage.getItem("token"));
  const { currentChat } = useContext(AppContext);

  const handleOnEnter = async () => {
    try {
      if (emoji === "") return;

      const { data } = await axios.post(
        `/message/sendmessage/${id}`,
        {
          chatid: currentChat._id,
          content: emoji,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEmoji("");
      setMessages([...messages, data]);
      let newMessage = {
        data,
        currentChat,
      };
      setNewmsg(data);
      socket.current.emit("new-message", newMessage);
    } catch (error) {
      return error;
    }
  };

  return (
    <section className="send-chat">
      <InputEmoji
        value={emoji}
        onChange={setEmoji}
        cleanOnEnter
        onEnter={handleOnEnter}
        className="form-input"
        placeholder="Type a message"
      />
      <button
        className="btn chat__btn"
        onClick={handleOnEnter}
      >
        Send
      </button>
    </section>
  );
};

export default SendChat;
