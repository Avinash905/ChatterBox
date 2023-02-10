import Chat from '../components/Chat'
import MyChats from '../components/MyChats'
import '../styles/chats.css'
import React from 'react'
import Navbar from '../components/Navbar'


const Chats = () => {

    return (
        <>
            <Navbar />
            <div className='chats__layout'>
                <MyChats />
                <Chat />
            </div>
        </>
    )
}

export default Chats