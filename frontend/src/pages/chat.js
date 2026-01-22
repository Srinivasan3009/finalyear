import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chat = () => {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const messagesEndRef = useRef(null);
  const email = localStorage.getItem("email");
console.log(email);
  const activeChat = chats.find(chat => chat._id === activeChatId);
  const userId =null;
 axios.get(`http://localhost:5000/users/profile/${email}`).then(res=> userId=res.data).catch(console.error);
  // 🔹 Load profile + chats
  useEffect(() => {
    if (!email) return;

    axios
      .get(`http://localhost:5000/users/profile/${userId}`)
      .then(res => setUser(res.data))
      .catch(console.error);

    axios
      .get(`http://localhost:5000/chat/user/${userId}`)
      .then(res => {
        setChats(res.data);
        if (res.data.length) setActiveChatId(res.data[0]._id);
      })
      .catch(console.error);
  }, [email, userId]);

  // 🔹 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!input.trim() || !activeChatId) return;

    await axios.post("http://localhost:5000/chat/message", {
      chatId: activeChatId,
      sender: "user",
      text: input
    });

    const res = await axios.get(
      `http://localhost:5000/chat/user/${userId}`
    );
    setChats(res.data);
    setInput("");
  };

  // 🔹 New chat
  const newChat = async () => {
    const res = await axios.post(
      "http://localhost:5000/chat/new",
      { userId }
    );

    setChats([res.data, ...chats]);
    setActiveChatId(res.data._id);
  };

  // 🔹 Delete chat
  const deleteChat = async (chatId) => {
    await axios.delete(`http://localhost:5000/chat/${chatId}`);
    setChats(chats.filter(c => c._id !== chatId));
    setActiveChatId(null);
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      {/* LEFT SIDEBAR */}
      <div style={styles.sidebar}>
        <button style={styles.newChatBtn} onClick={newChat}>
          + New Chat
        </button>

        {chats.map(chat => (
          <div
            key={chat._id}
            style={{
              ...styles.chatItem,
              background:
                chat._id === activeChatId ? "#2a2b32" : "transparent"
            }}
            onClick={() => setActiveChatId(chat._id)}
          >
            <span>{chat.title}</span>
           <button
  style={styles.deleteBtn}
  onClick={(e) => {
    e.stopPropagation();
    deleteChat(chat._id);
  }}
>
  🗑
</button>

          </div>
        ))}
      </div>

      {/* RIGHT CHAT AREA */}
      <div style={styles.chatArea}>
        {/* TOP BAR */}
        <div style={styles.topBar}>
          <div>Chat App</div>

          <div style={{ position: "relative" }}>
            <button
              style={styles.profileBtn}
              onClick={() => setShowProfile(!showProfile)}
            >
              👤
            </button>

            {showProfile && (
              <div style={styles.dropdown}>
                <p>{user?.username || "User"}</p>
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        </div>

        {/* MESSAGES */}
        <div style={styles.messages}>
          {activeChat?.messages?.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                alignSelf:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                background:
                  msg.sender === "user" ? "#DCF8C6" : "#F1F1F1"
              }}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.button}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#ffffff"
  },

  /* SIDEBAR */
  sidebar: {
    width: "260px",
    background: "#202123",
    color: "#fff",
    padding: "10px",
    display: "flex",
    flexDirection: "column"
  },
  newChatBtn: {
    padding: "10px",
    marginBottom: "10px",
    background: "#10a37f",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "5px"
  },
  chatItem: {
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    marginBottom: "5px"
  },

  /* CHAT AREA */
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  header: {
    padding: "15px",
    borderBottom: "1px solid #ddd",
    textAlign: "center",
    fontWeight: "bold"
  },
  messages: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto"
  },
  message: {
    padding: "12px 15px",
    borderRadius: "10px",
    maxWidth: "70%",
    marginBottom: "10px"
  },

  /* INPUT */
  inputArea: {
    display: "flex",
    padding: "15px",
    borderTop: "1px solid #ddd"
  },
  input: {
    flex: 1,
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    marginLeft: "10px",
    padding: "12px 20px",
    background: "#10a37f",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  deleteBtn: {
  background: "transparent",
  border: "none",
  color: "#888",
  cursor: "pointer",
  fontSize: "14px",
  marginLeft: "8px"
},
  topBar: {
  height: "50px",
  backgroundColor: "#202123",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 15px",
  color: "white"
},
profileBtn: {
  background: "transparent",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  color: "white"
}

};

export default Chat;
