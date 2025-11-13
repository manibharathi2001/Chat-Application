// AuthContext.js (replace your current file with this)
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL; // e.g. "http://localhost:5000"
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // attach token to axios if present
  useEffect(() => {
    if (token) {
      // your backend expects header named 'token' (based on earlier code)
      axios.defaults.headers.common["token"] = token;
    } else {
      delete axios.defaults.headers.common["token"];
    }
  }, [token]);

  // ----- Check auth on load -----
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      // don't spam user on initial load; log for debugging
      console.error("checkAuth error:", error?.response?.data || error.message);
    }
  };

  // ----- Login / Signup -----
  // state is either "signup" or "login"
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        // backend returns data.token and data.userData (or user)
        const userData = data.userData || data.user || null;
        setAuthUser(userData);
        setToken(data.token);
        localStorage.setItem("token", data.token);

        // attach axios header
        axios.defaults.headers.common["token"] = data.token;

        // connect socket after setting user
        connectSocket(userData);

        toast.success(data.message || "Authenticated");
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("login error:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || error.message || "Network error");
    }
  };

  // ----- Logout -----
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    delete axios.defaults.headers.common["token"];
    toast.success("Logged Out Successfully");

    if (socket) {
      try {
        socket.disconnect();
      } catch (e) {
        console.warn("socket disconnect failed", e);
      }
      setSocket(null);
    }
  };

  // ----- Update profile -----
  // body expected to contain { fullname, bio, profilePic } matching your backend
  const updateProfile = async (body) => {
    try {
      // Note: axios returns a response object; the real payload is response.data
      const response = await axios.put("/api/auth/update-profile", body);
      const data = response.data;
      if (data.success) {
        setAuthUser(data.user || data.userData || authUser);
        toast.success("Profile Updated Successfully!");
        return data;
      } else {
        toast.error(data.message || "Update failed");
        return data;
      }
    } catch (error) {
      console.error("updateProfile error:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || error.message || "Network error");
      throw error;
    }
  };

  // ----- Socket connection -----
  // Keep socket connect logic here so it can be reused by login/checkAuth
  const connectSocket = (userData) => {
    try {
      if (!userData) return;
      // if socket already connected and for same user, skip
      if (socket && socket.connected) {
        // if existing socket belongs to same user, done
        const sameUser = socket?.userId === userData._id;
        if (sameUser) return;
        // otherwise disconnect old socket before making new one
        try {
          socket.disconnect();
        } catch (e) {
          console.warn("old socket disconnect error", e);
        }
        setSocket(null);
      }

      // create socket instance
      const newSocket = io(backendUrl, {
        path: "/socket.io",
        transports: ["websocket", "polling"],
        // pass userId so server can map online users (server reads handshake.query.userId)
        query: { userId: userData._id },
        autoConnect: true,
        withCredentials: true,
      });

      // store userId on the socket for later checks
      newSocket.userId = userData._id;

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket connect error:", err);
      });

      newSocket.on("getOnlineUsers", (userIds) => {
        // server sends array of userIds
        setOnlineUsers(userIds || []);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      setSocket(newSocket);
    } catch (err) {
      console.error("connectSocket error:", err);
    }
  };

  // Clean up socket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        try {
          socket.disconnect();
        } catch (e) {
          toast.error(e.message)
        }
      }
    };
  }, [socket]);

  // run on mount
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
