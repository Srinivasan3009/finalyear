import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/signup";
import Chat from "./pages/chat";

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />}/>
        <Route
            path="/chat"
            element={
                <Chat />
            }
          />
      </Routes>
    </Router>
  );
}

export default App;
