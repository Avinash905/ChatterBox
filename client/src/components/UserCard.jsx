import React, { useEffect, useState } from "react";
import "../styles/usercard.css";
import jwt_decode from "jwt-decode";
import fetchData from "../helper/apiCall";

const UserCard = ({ imgClass, ele, clickFunc }) => {
  const { id } = jwt_decode(localStorage.getItem("token"));
  const [latestMsg, setLatestMsg] = useState("");
  const [latestMsgSender, setLatestMsgSender] = useState("");
  const otheruser = ele.users.filter((user) => user._id !== id)[0];

  const getMessage = async (ele) => {
    const message = await fetchData(
      `/message/getmessage/${id}/${ele.latestMessage}`
    );

    const data = await fetchData(`/user/getuser/${id}/${message.sender}`);

    setLatestMsg(message.content);
    setLatestMsgSender(data.name);
  };

  useEffect(() => {
    if (ele.latestMessage?.name) {
      getMessage(ele);
    }
  }, [ele]);

  // console.log("ele", " >> ", ele);

  return (
    <div
      className="usercard"
      key={ele._id}
      onClick={() => {
        clickFunc(ele);
      }}
    >
      <div className={`usercard__image flex-center ${imgClass}`}>
        <img
          src={
            !ele.isGroupChat
              ? otheruser.pic
              : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
          }
          alt="contact-pic"
        />
      </div>
      <div className="usercard__info">
        <h4 className="usercard__name">
          {ele.isGroupChat ? ele.chatName : otheruser.name}
        </h4>
        {latestMsg && (
          <p>
            {" "}
            <strong>{latestMsgSender}:</strong> {latestMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserCard;
