import React from 'react'
import '../styles/modal.css'
import { IoMdClose } from 'react-icons/io'

const Modal = ({ children, setModalOpen, handleClick, btnname, id }) => {

    return (
        <div className="modal flex-center">
            <div className="modal__content">
                <IoMdClose onClick={() => { setModalOpen(false) }} className='close-btn' />
                {children}
                <button className="btn" onClick={btnname === 'Leave Group' ? handleClick(id) : handleClick}>{btnname}</button>
            </div>
        </div>
    )
}

export default Modal