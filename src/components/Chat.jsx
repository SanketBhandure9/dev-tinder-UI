import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { USER_CHAT_HISTORY } from "../utils/constants";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { targetUserId } = useParams();
  const [targetUser, setTargetUser] = useState(null);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const fetchChatHistory = async () => {
    if (!targetUserId) return;
    try {
      let response = await axios.get(`${USER_CHAT_HISTORY}/${targetUserId}`, {
        withCredentials: true,
      });

      setTargetUser(response.data.data.targetUser);

      const chatHistory = response?.data?.data.messages.map((message) => {
        const { sender, text } = message;
        return {
          firstName: sender.firstName,
          lastName: sender.lastName,
          text,
          userId: sender._id,
        };
      });

      setMessages(chatHistory);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId || !targetUserId) return;

    socketRef.current = createSocketConnection();
    socketRef.current.emit("joinChat", { userId, targetUserId });

    socketRef.current.on(
      "messageReceived",
      ({ firstName, lastName, text, senderId }) => {
        setMessages((prev) => [
          ...prev,
          { firstName, lastName, text, userId: senderId },
        ]);
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    socketRef.current?.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      senderId: userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  if (!userId || !targetUserId) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-white px-4">
        <div className="flex flex-col items-center gap-4 p-6 rounded-xl shadow-lg border border-gray-200 bg-gradient-to-br from-white via-orange-50 to-pink-50 animate-fade-in">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            {!userId ? "Authenticating user..." : "Loading chat interface..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full bg-gray-50 h-full">
      <div className="flex flex-col w-full max-w-2xl sm:w-[90%] lg:w-[70%] xl:w-[60%] bg-white shadow-sm">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          {targetUser?.photoUrl ? (
            <img
              src={targetUser?.photoUrl}
              alt={`${targetUser?.firstName} ${targetUser?.lastName}`}
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
              {targetUser?.firstName?.[0]?.toUpperCase() || "U"}
            </div>
          )}

          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {targetUser
              ? `${targetUser.firstName} ${targetUser.lastName}`
              : "User"}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 space-y-4">
          {messages.map((message, index) => {
            const isOwn = message.userId === userId;
            return (
              <div
                key={index}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl shadow-sm text-base break-words ${
                    isOwn
                      ? "bg-green-100 text-gray-800"
                      : "bg-gray-100 text-gray-800"
                  } max-w-[80%] sm:max-w-md`}
                >
                  {message.text}
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <p className="text-center text-gray-400 mt-6">
              No messages yet. Start the conversation!
            </p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input (Sticky Bottom) */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-3 py-4 sm:px-6 z-10">
          <form
            className="flex w-full gap-3 items-center"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full rounded-xl border border-gray-300 bg-white text-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 transition p-3 rounded-full shadow-md focus:outline-none"
              aria-label="Send"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2.01 21L23 12 2.01 3v7l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
