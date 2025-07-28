import { useEffect, useState } from "react";
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

  const fetchChatHistory = async () => {
    let chatHistory = await axios.get(USER_CHAT_HISTORY + `/${targetUserId}`, {
      withCredentials: true,
    });

    chatHistory = chatHistory?.data?.messages.map((message) => {
      const { senderId, text } = message;
      return {
        firstName: senderId.firstName,
        lastName: senderId.lastName,
        text,
        userId: senderId._id,
      };
    });

    setMessages(chatHistory);
  };

  useEffect(() => {
    fetchChatHistory();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId || !targetUserId) {
      console.error("User ID or Target User ID is missing");
      return;
    }
    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      console.log("New message received:", text);
      setMessages((prevMessages) => [
        ...prevMessages,
        { firstName, lastName, text, userId: targetUserId },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) {
      alert("Message cannot be empty");
      return;
    }

    const socket = createSocketConnection();

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <>
      <div className="join">
        <div>
          <label className="input validator join-item">
            <input
              type="text"
              placeholder="Enter message"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              required
            />
          </label>
        </div>
        <button className="btn btn-neutral join-item" onClick={sendMessage}>
          Send
        </button>
      </div>
      <div>
        {messages.map((message, index) => (
          <div key={index} className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                />
              </div>
            </div>
            <div className="chat-bubble">{message.text}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Chat;
