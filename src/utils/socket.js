import { io } from "socket.io-client";
import { API_BASE_URL_LOCAL } from "./constants";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io(API_BASE_URL_LOCAL);
  } else {
    return io("/", { path: "/api/socket.io" });
  }
};
