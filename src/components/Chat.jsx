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
      <div className="flex flex-col min-h-screen bg-base-100 items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content/70">
            {!userId ? "Loading user data..." : "Loading chat..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full bg-gray-50 h-full">
      <div className="flex flex-col w-full max-w-2xl sm:w-[90%] lg:w-[70%] xl:w-[60%] bg-white shadow-sm">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Chat with {messages[0]?.firstName || "User"}
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
            <button type="submit" className="btn btn-primary px-5 rounded-xl">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
