const MessageBubble = ({ from, text }) => {
  const isAI = from === "ai";

  return (
    <div
      className={`bubble-row ${isAI ? "bubble-row-ai" : "bubble-row-user"}`}
    >
      {isAI && <span className="bubble-avatar">🤖</span>}
      <div className={`bubble ${isAI ? "bubble-ai" : "bubble-user"}`}>
        <div className="bubble-label">{isAI ? "AI 管家" : "您"}</div>
        <div className="bubble-text">{text}</div>
      </div>
      {!isAI && <span className="bubble-avatar">🧓</span>}
    </div>
  );
};

export default MessageBubble;
