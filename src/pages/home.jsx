import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axiosConfig";

function Home() {
  //useState
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // Get a unique random color
  const getRandomColor = () => {
    const colors = [
      "bg-pink-200 border border-pink-300 shadow-sm",
      "bg-blue-200 border border-blue-300 shadow-sm",
      "bg-green-200 border border-green-300 shadow-sm",
      "bg-yellow-200 border border-yellow-300 shadow-sm",
      "bg-purple-200 border border-purple-300 shadow-sm",
      "bg-orange-200 border border-orange-300 shadow-sm",
      "bg-teal-200 border border-teal-300 shadow-sm",
      "bg-gray-200 border border-gray-300 shadow-sm",
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Add new note
  const addNote = () => {
    setNotes([
      ...notes,
      {
        _id: notes.length + 1,
        description: "",
        date: new Date().toISOString().split("T")[0],
        color: getRandomColor(),
      },
    ]);
  };

  // Update a note
  const updateNote = (_id, Content) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === _id ? { ...note, description: Content } : note
      )
    );
  };

  // Function to delete a note
  // const deleteNote = (id) => {
  //   setNotes(notes.filter((note) => note.id !== id));
  // };

  //  Fetch notes from MongoDB when the page loads (GET API)
  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("Token"); // Get token from local storage
      console.log("🔑 Token from LocalStorage:", token); // Debugging

      if (!token) {
        console.error("❌ No Token Found");
        return;
      }

      try {
        const res = await API.get("http://localhost:3000/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const filteredNotes = res.data.filter((note) => !note.deletedAt); // Ignore deleted notes
        setNotes(filteredNotes);

        console.log("📄 Notes from DB:", res.data); // Debugging
        setNotes(res.data);
      } catch (err) {
        console.error("❌ Error fetching notes:", err);
      }
    };
    fetchNotes();
  }, []);

  // Save note to MongoDB (POST API)
  const saveNote = async (_id, content, color) => {
    const date = new Date().toISOString().split("T")[0]; // Send consistent date format

    if (!content.trim()) {
      alert("⚠️ Note cannot be empty!");
      return;
    }

    const token = localStorage.getItem("Token");
    console.log("🔑 Token before POST request:", token); // Debugging

    if (!token) {
      console.error("❌ No token found");
      return;
    }

    try {
      const res = await API.post(
        "http://localhost:3000/notes",
        { description: content, createdAt: date, color },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Response received:", res.data);
      alert("✅ Note saved!");
    } catch (err) {
      console.error("❌ Error:", err.response ? err.response.data : err);
      alert("❌ Error saving note!");
    }
  };

  // update the note in db (UPDATE API)
  const updateNoteInDB = async (_id, content) => {
    if (!content.trim() || !content) {
      alert("⚠️ Note cannot be empty!");
      return;
    }

    const token = localStorage.getItem("Token");

    try {
      setLoading(true);
      const res = await API.put(
        `http://localhost:3000/notes/${_id}`,
        { description: content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("✅ Note updated successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(
        "❌ Error updating note:",
        err.response ? err.response.data : err
      );
      alert("❌ Failed to update note!");
    } finally {
      setLoading(false);
    }
  };

  // Delete a note from MongoDB and frontend (DELETE API)
  const deleteNote = async (_id) => {
    console.log("🛠️ Deleting note with ID:", _id); // Debugging
    if (!_id) {
      alert("❌ Error: ID is undefined!");
      return;
    }

    const token = localStorage.getItem("Token");

    try {
      const res = await API.delete(`http://localhost:3000/notes/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}, "Content-Type": "application/json" `,
        },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== _id));
      alert(res.data.message);
    } catch (err) {
      console.error(
        "❌ Error deleting note:",
        err.response ? err.response.data : err
      );
      alert("❌ Failed to delete note!");
    }
  };

  // Store the data in local storage
  useEffect(() => {
    // Get user name from localStorage
    const userName = localStorage.getItem("userName");
    console.log("Stored User Name:", userName); // Debugging

    if (userName) {
      setUser(userName);
    }
  }, []);

  //delete the data in local storage
  const handleLogout = () => {
    localStorage.removeItem("Token"); // Remove token
    localStorage.removeItem("userName");
    localStorage.removeItem("user"); //  Remove user data
    navigate("/");
  };

  return (
    <div className="flex  h-screen bg-white ">
      <div className="w-28 bg-slate-50 shadow-md flex flex-col items-center py-6">
        <button className="mb-52 ml-5">
          <img src="/images/Logo-3.png" />
        </button>

        <button className="mb-6 -ml-7">
          <img src="/images/House.png" />
        </button>

        <button onClick={addNote} className="mb-6 pl-2">
          <img src="/images/plus.svg" />
        </button>

        <button onClick={handleLogout} className="mt-auto ml-3">
          <img src="/images/log-out.svg" />
        </button>
      </div>

      <div className="mt-5 ml-36">
        {/* <a href="#">
        <img className="mr-1 mt-2" src="/images/search.png" />
      </a> */}
        <input
          className="w-full max-w-lg px-2 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          type="text"
          placeholder="Search Notes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* <a href="">
        <img className="flex ml-96" src="/images/Dark Mode.png" />
      </a> */}
      </div>

      <div className="mt-28 -ml-48">
        <h1 className="text-3xl mb-2">
          Hello,{" "}
          <p className="font-bold inline-block">{user ? user : "Guest"}!</p>👋🏻
        </h1>
        <p className="text-gray-700">All your notes are here, in one place!</p>
      </div>

      <div className="grid grid-cols-4 gap-16 mt-56 -ml-80">
        {notes
          .filter((note) =>
            note.description.toLowerCase().includes(search.toLowerCase())
          )
          .map((note) => (
            <div key={note._id}>
              <textarea
                className={`w-52 h-48 pl-5 pr-5 pt-4 pb-2 mb-1 resize-none ${note.color} rounded-md block`}
                placeholder="Write your note..."
                value={note.description}
                onChange={(e) => updateNote(note._id, e.target.value)} //Updates the correct note
              >
                {note.description}
              </textarea>

              <button onClick={() => deleteNote(note._id)}>
                <img src="/images/trash-2.svg" />
              </button>

              <button
                onClick={() => saveNote(note._id, note.description, note.color)}
              >
                <img src="/images/save.svg" />
              </button>

              <button
                onClick={() => updateNoteInDB(note._id, note.description)}
                disabled={loading}
              >
                <img src="/images/edit.png" className="h-6 ml-1" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Home;
