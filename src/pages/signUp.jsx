import React from "react";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Validate Fields
    if (!formData.name || !formData.email || !formData.password) {
      alert("⚠️ All fields are required!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/users", formData);
      const { token, user } = res.data; // Receive token and user data from backend
      localStorage.setItem("Token", token); // Store token in localStorage
      localStorage.setItem("user", JSON.stringify(user)); // Store user data in localStorage
      localStorage.setItem("userName", res.data.user.name); // Ensure name is stored

      alert("✅ Login successfully");
      navigate("/home"); // Redirect to Home Page
    } catch (err) {
      alert(err.response?.data?.msg);
    }
  };

  return (
    <div className="flex container h-screen w-screen">
      <div className="flex-1 content-center">
        <img className="mt-32 ml-auto mr-52" src="/images/Group 9.png" />

        <h1 className="mt-10 ml-40 font-semibold text-4xl">Keep Life simple</h1>

        <p className="mt-4 ml-40 text-gray-500">
          Store all your in a simple and intuitive <br /> app that helps you
          enjoy what is <br /> most important in life.
        </p>
      </div>

      <div className="flex-1 content-center bg-slate-100">
        <img
          className="flex mt-20 ml-auto mr-64 mb-14"
          src="/images/Logo.png"
        />

        <button
          onClick={handleChange}
          className="flex justify-center ml-auto mr-60 mb-8 pr-20 pl-20 pt-2 pb-2 text-white rounded-md text-base"
        >
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const credentialResponseDecoded = jwtDecode(
                credentialResponse.credential
              );
              setFormData({
                name: credentialResponseDecoded.name,
                email: credentialResponseDecoded.email,
              });

              console.log({ credentialResponseDecoded });
            }}
            onError={() => {
              console.log("login failed");
            }}
          />
        </button>

        <div className="flex justify-center">
          <hr className="w-20 inline-flex mt-3  text-gray-900" />
          <p className="inline-flex text-gray-500 ml-4 ">or Join anonymously</p>
          <hr className="w-20 inline-flex ml-4 mt-3 mr-8 text-gray-900" />
        </div>

        <form onSubmit={handleSubmit}>
          <input
            className="flex justify-center ml-auto mt-9 mr-60 mb-8 pt-1 pb-1 w-80 pl-3 rounded"
            name="name"
            type="text"
            placeholder="Type Your Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            className="flex justify-center ml-auto mt-9 mr-60 mb-8 pt-1 pb-1 w-80 pl-3 rounded"
            name="email"
            type="email"
            placeholder="Type Your Email"
            onChange={handleChange}
            value={formData.email}
          />

          <input
            className="flex justify-center ml-auto mt-9 mr-60 mb-8 pt-1 pb-1 w-80 pl-3 rounded"
            name="password"
            type="password"
            placeholder="Type Your Password"
            onChange={handleChange}
          />
          <button
            onClick={handleChange}
            className="flex justify-center ml-auto mr-60 mb-8 pr-20 pl-20 pt-2 pb-2 bg-green-400 text-white rounded-md text-base"
          >
            <img className="pr-2" src="/images/log-in 1.png" />
            Join anonymously
          </button>
        </form>

        <p className="ml-72">
          Have an account?
          <Link className="text-blue-900" to="/">
            {" "}
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
