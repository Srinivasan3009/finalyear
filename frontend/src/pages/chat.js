import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messageInput, setMessageInput] = useState("");

  const messagesEndRef = useRef(null);
const currentChat = chats.find((c) => c._id === currentChatId);

  // Get userId and username from a global object or context
  const userId =localStorage.getItem("id"); // set this after login
  const username = localStorage.getItem("username") || "Guest";

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatId, chats]);

  // Load all chats for user
 const loadChats = useCallback(async () => {
  if (!userId) return;

  try {
    const res = await axios.get(`http://localhost:5000/chat/user/${userId}`);
    setChats(res.data);

    // If no chat selected, auto select first
    if (res.data.length && !currentChatId) {
      setCurrentChatId(res.data[0]._id);
    }
  } catch (err) {
    console.error("Error loading chats:", err);
  }
}, [userId, currentChatId]);


 useEffect(() => {
  loadChats();
}, [loadChats]);



  // Current chat
  useEffect(() => {
  if (!currentChatId) {
    setMessages([]);
    return;
  }

  const chat = chats.find((c) => c._id === currentChatId);
  if (chat) setMessages(chat.messages || []);
}, [currentChatId, chats]);


  // Send a message
  const sendMessage = async () => {
  if (!messageInput.trim() || !currentChatId) return;

  const newMsg = {
    sender: "user",
    text: messageInput.trim(),
  };

  // Show instantly in UI
  setMessages((prev) => [...prev, newMsg]);
  setMessageInput("");
  setLoading(true);

  try {
    await axios.post("http://localhost:5000/chat/message", {
      chatId: currentChatId,
      sender: "user",
      text: newMsg.text,
    });

    // Reload chats to sync with DB
    await loadChats();
  } catch (err) {
    console.error("Send message error:", err);
  }

  setLoading(false);
};


  // Create new chat
  const createNewChat = async () => {
    try {
      const res = await axios.post("http://localhost:5000/chat/new", { userId });
      setChats([res.data, ...chats]);
      setCurrentChatId(res.data._id);
    } catch (err) {
      console.error("New chat error:", err);
    }
  };

  // Delete chat
  const deleteChat = async (chatId) => {
    try {
      await axios.delete(`http://localhost:5000/chat/${chatId}`);
      const updatedChats = chats.filter((c) => c._id !== chatId);
      setChats(updatedChats);
      if (chatId === currentChatId) {
        setCurrentChatId(updatedChats.length ? updatedChats[0]._id : null);
      }
    } catch (err) {
      console.error("Delete chat error:", err);
    }
  };

  // Logout
  const logout = () => {
    window.AppUser = null; // clear global
    window.location.href = "/";
  };

  return (
  <div className="container-fluid vh-100">
    <div className="row h-100">

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="col-3 bg-dark text-white d-flex flex-column p-0">
          <div className="p-3 border-bottom border-secondary">
            <button
              onClick={createNewChat}
              className="btn btn-secondary w-100"
            >
              + New Chat
            </button>
          </div>

          <div className="flex-grow-1 overflow-auto p-2">
            {chats.length === 0 ? (
              <div className="text-secondary text-center mt-4">
                No chats yet. Start a new conversation!
              </div>
            ) : (
              <ul className="list-group list-group-flush">
                {chats.map((chat) => (
                  <li
                    key={chat._id}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                      currentChatId === chat._id ? "active" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setCurrentChatId(chat._id)}
                  >
                    <span className="text-truncate">{chat.title || "Chat"}</span>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat._id);
                      }}
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="col d-flex flex-column p-0">

        {/* Header */}
        <div className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-outline-secondary d-lg-none"
          >
            ☰
          </button>

          <h5 className="mb-0">{currentChat?.title || "New Chat"}</h5>

          <div className="dropdown">
            <button
              className="btn btn-light d-flex align-items-center gap-2"
              data-bs-toggle="dropdown"
            >
              <div
                className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                style={{ width: "40px", height: "40px" }}
              >
                {username.slice(0, 2).toUpperCase()}
              </div>
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow">
              <li className="px-3 py-1 fw-bold">{username}</li>
              <li>
                <button className="dropdown-item text-danger" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Messages */}
        <div
    className="flex-grow-1 overflow-auto p-3 bg-light"
    style={{ minHeight: 0 }}
  >
    {messages.length === 0 ? (
      <div className="text-muted text-center mt-4">
        No messages yet. Start chatting!
      </div>
    ) : (
      messages.map((msg, idx) => (
        <div
          key={idx}
          className={`d-flex mb-2 ${
            msg.sender === "user" ? "justify-content-end" : "justify-content-start"
          }`}
        >
          <div
            className={`p-2 rounded ${
              msg.sender === "user"
                ? "bg-primary text-white"
                : "bg-white border"
            }`}
            style={{ maxWidth: "60%" }}
          >
            {msg.text}
          </div>
        </div>
      ))
    )}
    <div ref={messagesEndRef} />
  </div>

  {/* Input Section */}
  <div className="border-top bg-white p-3 flex-shrink-0">
    <div className="d-flex align-items-end gap-2">
      <textarea
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type your message..."
        className="form-control chat-textarea"
        rows={1}
        onKeyDown={(e) =>
          e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())
        }
      />
      <button
        onClick={sendMessage}
        disabled={!messageInput.trim() || loading}
        className="btn btn-primary px-4"
        style={{ height: "42px" }}
      >
        Send
      </button>
    </div>
  </div>


      </div>
    </div></div>
);

};

export default Chat;
