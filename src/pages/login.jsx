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
        <img className="mt-4 md:mt-36 md:ml-auto md:mr-64 mb-6 mx-auto" src="/images/Logo.png" />

        <form onSubmit={handleSubmit}>
          <input
            className="mt-6 md:mt-9 md:mb-4 pt-2 pb-2 w-72 md:w-80 pl-2 rounded mx-auto md:ml-52 md:mr-60"
            name="email"
            type="email"
            placeholder="Type Your Email"
            onChange={handleChange}
          />

          <input
            className="mt-4 md:mt-9 mb-4 md:mb-8 pt-2 pb-2 w-72 md:w-80 pl-2 rounded mx-auto md:ml-52 md:mr-60"
            name="password"
            type="password"
            placeholder="Type Your Password"
            onChange={handleChange}
          />

          <button
            onClick={handleChange}
            className="mt-2 md:mb-12 pr-24 pl-24 md:pr-32 md:pl-28 pt-2 pb-2 bg-green-400 text-white rounded-md text-base mx-auto md:ml-auto md:mr-60 flex items-center justify-center"
          >
            <img className="pr-2" src="/images/log-in 1.png" />
            Log in
          </button>
        </form>

        <p className="mt-4 md:ml-64">
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
