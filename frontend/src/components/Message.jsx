function Message({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
          isUser ? "bg-black text-white" : "bg-white text-gray-800 shadow-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default Message;
