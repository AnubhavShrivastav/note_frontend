import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
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
    if (!formData.email || !formData.password) {
      alert("⚠️ All fields are required!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/users/login",
        formData
      );

      const { token, user } = res.data;
      localStorage.setItem("Token", token); // ✅ Store token
      localStorage.setItem("user", JSON.stringify(user)); // ✅ Store user data
      localStorage.setItem("userName", res.data.user.name);

      alert("✅ Login successfully");
      navigate("/home"); // Redirect to Home Page
    } catch (err) {
      alert(err.response?.data?.msg);
      console.error("Login failed:", err.response?.data?.message);
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
          className="flex mt-36 ml-auto mr-64 mb-14"
          src="/images/Logo.png"
        />

        <form onSubmit={handleSubmit}>
          <input
            className="flex justify-center ml-auto mt-9 mr-60 mb-8 pt-1 pb-1 w-80 pl-2 rounded"
            name="email"
            type="email"
            placeholder="Type Your Email"
            onChange={handleChange}
          />

          <input
            className="flex justify-center ml-auto mt-9 mr-60 mb-8 pt-1 pb-1 w-80 pl-2 rounded"
            name="password"
            type="password"
            placeholder="Type Your Password"
            onChange={handleChange}
          />
          <button
            onClick={handleChange}
            className="flex justify-center ml-auto mr-60 mb-12 pr-32 pl-28 pt-2 pb-2 bg-green-400 text-white rounded-md text-base"
          >
            <img className="pr-2" src="/images/log-in 1.png" />
            Log in
          </button>
        </form>
        <p className="ml-64">
          Don't have an account?{" "}
          <Link className="text-blue-900" to="./signUp">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
