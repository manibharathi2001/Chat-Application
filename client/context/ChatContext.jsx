// ChatContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // ---- get all users ----
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users || []);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      console.error("getUsers error:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || error.message || "Failed to load users");
    }
  };

  // ---- get messages for a user (pass userId explicitly) ----
  // const getMessages = async (userId) => {
  //   if (!userId) return;
  //   try {
  //     const { data } = await axios.get(`/api/messages/${userId}`);
  //     if (data.success) {
  //       setMessages(data.messages || []);
  //     }
  //   } catch (error) {
  //     console.error("getMessages error:", error?.response?.data || error.message);
  //     toast.error(error?.response?.data?.message || error.message || "Failed to load messages");
  //   }
  // };

  const getMessages = async (userId) => {
  if (!userId) {
    console.warn("getMessages: missing userId");
    return;
  }

  try {
    const res = await axios.get(`/api/messages/${userId}`);
    console.log("getMessages response:", res?.data);

    const payload = res?.data;

    // Try multiple possible shapes:
    // 1) { success: true, messages: [...] }
    // 2) { messages: [...] }
    // 3) [...] (direct array)
    let msgs = [];
    if (Array.isArray(payload)) msgs = payload;
    else if (Array.isArray(payload?.messages)) msgs = payload.messages;
    else if (Array.isArray(payload?.data)) msgs = payload.data; // sometimes nested
    else if (payload?.success && Array.isArray(payload?.messages)) msgs = payload.messages;

    // Last resort: if server returned an object with a single array-like prop, try to find it
    if (msgs.length === 0) {
      const arrProp = Object.values(payload).find((v) => Array.isArray(v));
      if (arrProp) msgs = arrProp;
    }

    setMessages(msgs || []);
    if (!msgs || msgs.length === 0) {
      console.info("getMessages: no messages returned (check response shape or conversation).");
    }
  } catch (error) {
    console.error("getMessages error:", error?.response?.data || error.message, error);
    toast.error(error?.response?.data?.message || error.message || "Failed to load messages");
  }
};


  // ---- send message to selected user ----
  const sendMessage = async (messageData) => {
    if (!selectedUser) {
      toast.error("No recipient selected");
      return;
    }
    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("sendMessage error:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || error.message || "Failed to send message");
    }
  };

  // ---- subscribe to socket newMessage events ----
  const subscribeToMessage = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const senderId = newMessage?.senderId ?? newMessage?.senderID ?? null;

      if (selectedUser && senderId === selectedUser._id) {
        // Always fetch latest messages for the selected user
        getMessages(selectedUser._id);
        // mark as seen on server (fire-and-forget)
        axios.put(`/api/messages/mark/${newMessage._id}`).catch((err) => {
          console.warn("mark seen failed", err?.response?.data || err.message);
        });
      } else {
        // increment unseen count for sender
        setUnseenMessages((prev) => ({
          ...prev,
          [senderId]: prev[senderId] ? prev[senderId] + 1 : 1,
        }));
      }
    });
  };

  // ---- unsubscribe socket ----
  const unsubscribeFromMessages = () => {
    if (!socket) return;
    socket.off("newMessage");
  };

  // subscribe/unsubscribe when socket or selectedUser changes
  useEffect(() => {
    subscribeToMessage();
    return () => unsubscribeFromMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, selectedUser]);

  // Expose functions and state
  const value = {
    messages,
    setMessages,
    getUsers,
    getMessages,
    sendMessage,
    setUnseenMessages,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
