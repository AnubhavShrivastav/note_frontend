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
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, formData);
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
    <div className="flex flex-col md:flex-row container min-h-screen w-screen">
      <div className="flex-1 content-center text-center md:text-left">
        <img className="mt-12 md:mt-32 md:ml-auto md:mr-52 mx-auto" src="/images/Group 9.png" />

        <h1 className="mt-6 md:mt-10 md:ml-40 font-semibold text-3xl md:text-4xl">
          Keep Life simple
        </h1>

        <p className="mt-2 md:mt-4 md:ml-40 text-gray-500 text-sm md:text-base">
          Store all your in a simple and intuitive <br className="hidden md:block" /> app that helps you
          enjoy what is <br className="hidden md:block" /> most important in life.
        </p>
      </div>

      <div className="flex-1 content-center bg-slate-100 pt-8 md:pt-0 text-center md:text-left">
        <img
          className="mt-10 md:mt- md:ml-auto md:mr-64 mb-10 mx-auto"
          src="/images/Logo.png"
        />

        <div className="flex justify-center md:justify-center">
          <button
            onClick={handleChange}
            className="mb-6 pr-16 pl-16 md:pr-20 md:pl-20 pt-2 pb-2 text-white rounded-md text-base"
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
        </div>

        <div className="flex justify-center items-center mt-3 mb-4">
          <hr className="w-16 md:w-20" />
          <p className="mx-4 text-gray-500 text-sm md:text-base">or Join anonymously</p>
          <hr className="w-16 md:w-20" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center md:block">
            <input
              className="mt-4 md:mt-9 mb-4 md:mb-2 pt-2 pb-2 w-72 md:w-80 pl-3 rounded mx-auto md:ml-60 md:mr-60"
              name="name"
              type="text"
              placeholder="Type Your Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              className="mt-4 md:mt-9 mb-4 md:mb-2 pt-2 pb-2 w-72 md:w-80 pl-3 rounded mx-auto md:ml-60 md:mr-60"
              name="email"
              type="email"
              placeholder="Type Your Email"
              onChange={handleChange}
              value={formData.email}
            />

            <input
              className="mt-4 md:mt-9 mb-4 md:mb-10 pt-2 pb-2 w-72 md:w-80 pl-3 rounded mx-auto md:ml-60 md:mr-60"
              name="password"
              type="password"
              placeholder="Type Your Password"
              onChange={handleChange}
            />

            <button
              onClick={handleChange}
              className="mt-2 md:mb-8 pr-16 pl-16 md:pr-20 md:pl-20 pt-2 pb-2 bg-green-400 text-white rounded-md text-base mx-auto md:ml-auto md:mr-60 flex items-center justify-center"
            >
              <img className="pr-2" src="/images/log-in 1.png" />
              Join anonymously
            </button>
          </div>
        </form>

        <p className="mt-4 md:ml-72 text-sm md:text-base">
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
