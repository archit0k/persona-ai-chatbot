import { useState, useEffect, useRef } from "react";
import "./index.css";

const API_URL = "http://localhost:5000/chat";

function App() {
  const [persona, setPersona] = useState("anshuman");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  const personas = {
    anshuman: "Anshuman Singh",
    abhimanyu: "Abhimanyu Saxena",
    kshitij: "Kshitij Mishra"
  };

  const getSuggestions = (persona) => {
    if (persona === "anshuman") {
      return [
        "Explain recursion simply",
        "What is dynamic programming?",
        "How to approach trees?"
      ];
    }
    if (persona === "abhimanyu") {
      return [
        "How to build a startup?",
        "DSA vs projects?",
        "How to stay consistent?"
      ];
    }
    return [
      "How to solve DP problems?",
      "Sliding window pattern?",
      "How to improve speed?"
    ];
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: input,
          persona
        })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error: Could not fetch response." }
      ]);
    }

    setLoading(false);
  };

  const handlePersonaChange = (p) => {
    setPersona(p);
    setMessages([]);
  };

  return (
    <div className="app">
      
      {/* Header */}
      <div className="header">
        {Object.keys(personas).map((key) => (
          <button
            key={key}
            className={persona === key ? "active" : ""}
            onClick={() => handlePersonaChange(key)}
          >
            {personas[key]}
          </button>
        ))}
      </div>

      {/* Suggestion Chips */}
      <div className="chips">
        {getSuggestions(persona).map((text, i) => (
          <button key={i} onClick={() => setInput(text)}>
            {text}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="chat" ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="bot">Typing...</div>}
      </div>

      {/* Input */}
      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask something..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;