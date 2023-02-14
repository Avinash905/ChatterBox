import React from "react";
import "../styles/modal.css";
import { IoMdClose } from "react-icons/io";

const Modal = ({ children, setModalOpen, handleClick, btnname, mClass }) => {
  return (
    <div className="modal flex-center">
      <div className={`modal__content ${mClass}`}>
        <IoMdClose
          onClick={() => {
            setModalOpen(false);
          }}
          className="close-btn"
        />
        {children}
        {btnname && (
          <button
            className="btn"
            onClick={handleClick}
          >
            {btnname}
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
