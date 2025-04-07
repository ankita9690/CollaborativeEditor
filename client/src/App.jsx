import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // Replace with Render link when deployed

function App() {
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("init", (initialText) => setText(initialText));
    socket.on("text-change", (newText) => setText(newText));

    return () => {
      socket.off("init");
      socket.off("text-change");
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    socket.emit("text-change", value);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📝 Collaborative Editor</h1>
      <textarea
        style={{ width: "100%", height: "300px", fontSize: "1rem" }}
        value={text}
        onChange={handleChange}
        placeholder="Start typing..."
      />
    </div>
  );
}

export default App;
