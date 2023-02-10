import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Register() {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    password: "",
    confpassword: "",
    pic: "",
  });
  const navigate = useNavigate();

  const inputChange = async (e) => {
    const { name } = e.target;
    if (name === "pic") {
      const base64 = await convertToBase64(e.target.files[0]);
      return setFormDetails({
        ...formDetails,
        pic: base64,
      });
    }

    return setFormDetails({
      ...formDetails,
      [name]: e.target.value,
    });
  };

  const formSubmit = async (e) => {
    try {
      e.preventDefault();
      let { name, pic, email, password, confpassword } = formDetails;
      if (!name || !email || !password || !confpassword) {
        return toast.error("Input field should not be empty");
      } else if (password.length < 5) {
        return toast.error("Password must be at least 5 characters long");
      } else if (password !== confpassword) {
        return toast.error("Passwords do not match");
      }
      if (!pic) {
        pic = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
      }
      const { data } = await toast.promise(
        axios.post("/user/register", {
          name,
          pic,
          email,
          password,
        }),
        {
          pending: "Registering user...",
          success: "User registered successfully",
          error: "Unable to register user",
          loading: "Registering user...",
        }
      );
      return navigate("/");
    } catch (error) {
      return error;
    }
  };

  const convertToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <section className="register-section flex-center">
      <div className="register-container flex-center">
        <h2 className="form-heading">Sign Up</h2>
        <form onSubmit={formSubmit} className="register-form">
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="Enter your name"
            value={formDetails.name}
            onChange={inputChange}
          />
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formDetails.email}
            onChange={inputChange}
          />
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            value={formDetails.password}
            onChange={inputChange}
          />
          <input
            type="password"
            name="confpassword"
            className="form-input"
            placeholder="Confirm your password"
            value={formDetails.confpassword}
            onChange={inputChange}
          />
          <input
            type="file"
            name="pic"
            className="form-input"
            onChange={inputChange}
          />
          <button type="submit" className="btn form-btn">
            sign up
          </button>
        </form>
        <p>
          Already a user?{" "}
          <NavLink className="login-link" to={"/"}>
            Log in
          </NavLink>
        </p>
      </div>
    </section>
  );
}

export default Register;
