import React, { useEffect, useState, useContext, useRef } from 'react'
import jwt_decode from 'jwt-decode'
import '../styles/chat.css'
import SendChat from './SendChat'
import AppContext from '../context/userContext'
import fetchData from '../helper/apiCall'
import { AiFillSetting } from 'react-icons/ai'
import GroupChatModal from './GroupChatModal'
import { io } from 'socket.io-client'


const Chat = () => {
  const { currentChat } = useContext(AppContext)
  const [messages, setMessages] = useState([])
  const { id } = jwt_decode(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [newmsg, setNewmsg] = useState({})
  let socket = useRef()

  const getAllMessages = async () => {
    const data = await fetchData(`/message/getallmessages/${id}/${currentChat._id}`)

    setMessages(data)
    socket.current.emit('join-chat', currentChat._id)
  }

  useEffect(() => {
    if (currentChat._id) {
      getAllMessages()
      console.log('...')
    }
  }, [currentChat])

  useEffect(() => {
    socket.current?.on('message-recieved', (newMessage) => {
      setMessages([...messages, newMessage.data])
    })
  })

  useEffect(() => {
    socket.current = io.connect(process.env.REACT_APP_SERVER_BASE)
    socket.current.emit('setup', id);
  }, [])

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  const scroll = useRef()

  const fetchUser = async () => {
    const otherid = currentChat.users.filter(user => user !== id)[0]
    const userData = await fetchData(`/user/getuser/${id}/${otherid}`)
    setUserInfo(userData)
  }

  useEffect(() => {
    if (currentChat._id) {
      fetchUser()
    }
  }, [currentChat])


  if (!currentChat._id) return <section className='chat'><h2 className='flex-center' style={{ height: '100%' }}>Click on a chat to view messages</h2></section>


  return (
    <section className="chat">
      <div className='chat__top'>
        <h2 className='chat__name'>{currentChat.isGroupChat ? currentChat.chatName : userInfo.name}</h2>
        {currentChat.isGroupChat && <AiFillSetting className='gear-icon' onClick={() => { setModalOpen(true) }} />}
      </div>
      <GroupChatModal modalOpen={modalOpen} setModalOpen={setModalOpen} type={'update'} groupname={currentChat.chatName} group={currentChat} />
      <div className="chat__box">
        {
          messages.map((ele, i) => {
            return ele.senderId === id ? <div className="single-chat own__chat" key={i} ref={scroll} >
              <div className="single-chat__content flex-center">
                <p>{ele.content}</p>
              </div>
              <div className="single-chat__pic flex-center" >
                <img src={ele.senderPic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} alt="pic" />
              </div>
            </div> :
              <div className="single-chat" key={i} ref={scroll}>
                <div className="single-chat__pic flex-center" >
                  <img src={ele.senderPic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} alt="pic" />
                </div>
                <div className="single-chat__content flex-center">
                  <p>{ele.content}</p>
                </div>
              </div>
          })
        }
      </div>
      <SendChat socket={socket} setMessages={setMessages} messages={messages} setNewmsg={setNewmsg} />
    </section>
  )
}

export default Chat




