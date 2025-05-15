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
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-full md:w-28 bg-slate-50 shadow-md flex flex-row md:flex-col items-center justify-between md:justify-start py-4 md:py-6 px-4 md:px-0">
        <button className="mb-0 md:mb-52">
          <img src="/images/Logo-3.png" />
        </button>

        <div className="flex md:flex-col items-center gap-4 md:gap-6">
        <button className=" md:mb-5 ml-3">
        <img src="/images/home.svg" />
          </button>

          <button onClick={addNote} className="pl-2">
            <img src="/images/plus.svg" />
          </button>
        </div>

        <button onClick={handleLogout} className="mt-0 md:mt-auto md:ml-3">
          <img src="/images/log-out.svg" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:ml-10">
        {/* Search Bar */}
        <div className="mt-4 md:mt-5">
          <input
            className="w-full max-w-lg px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
            type="text"
            placeholder="Search Notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Greeting */}
        <div className="mt-6 md:mt-10">
          <h1 className="text-xl md:text-3xl mb-1 md:mb-2">
            Hello,{" "}
            <span className="font-bold">{user ? user : "Guest"}!</span> 👋🏻
          </h1>
          <p className="text-gray-700 text-sm md:text-base">
            All your notes are here, in one place!
          </p>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {notes
            .filter((note) =>
              note.description.toLowerCase().includes(search.toLowerCase())
            )
            .map((note) => (
              <div key={note._id}>
                <textarea
                  className={`w-full h-48 px-4 py-3 resize-none ${note.color} rounded-md block mb-2`}
                  placeholder="Write your note..."
                  value={note.description}
                  onChange={(e) => updateNote(note._id, e.target.value)}
                />

                <div className="flex items-center gap-3">
                  <button onClick={() => deleteNote(note._id)}>
                    <img src="/images/trash-2.svg" />
                  </button>

                  <button
                    onClick={() =>
                      saveNote(note._id, note.description, note.color)
                    }
                  >
                    <img src="/images/save.svg" />
                  </button>

                  <button
                    onClick={() =>
                      updateNoteInDB(note._id, note.description)
                    }
                    disabled={loading}
                  >
                    <img src="/images/edit.png" className="h-6" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

}

export default Home;
