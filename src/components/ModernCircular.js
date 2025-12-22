import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./jimmy.css"; // Separate CSS for this component

const SmartNoticeGenerator = () => {
  const [open, setOpen] = useState(true); // Chatbot visible immediately
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! I'm your Smart Notice Assistant." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending messages & generating notice
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/generate_notice",
        { template: input, description: input },
        { responseType: "blob" }
      );

      // Trigger PDF download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "SmartNotice.pdf");
      document.body.appendChild(link);
      link.click();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "✅ Your Smart Notice has been generated and downloaded!" },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "❌ Something went wrong!" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="smart-notice-wrapper">
      {open && (
        <div className="smart-notice-window">
          {/* Header */}
          <div className="smart-notice-header">
            Smart Notice Bot
            <span className="close-btn" onClick={() => setOpen(false)}>✖️</span>
          </div>

          {/* Messages */}
          <div className="smart-notice-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="message bot typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="smart-notice-input">
            <input
              type="text"
              placeholder="Type a topic..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSend} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartNoticeGenerator;

