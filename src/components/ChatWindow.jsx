export default function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`msg-row ${msg.role === "user" ? "user" : "assistant"}`}
        >
          {/* avatar */}
          <div className="msg-avatar">
            {msg.role === "user" ? "🧓" : "🤖"}
          </div>

          {/* bubble */}
          <div className="msg-bubble">{msg.text}</div>
        </div>
      ))}
    </div>
  );
}
