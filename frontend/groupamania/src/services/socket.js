import { io } from "socket.io-client";
import { getCurrentUser } from "./userService";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

// Auto-register the user when logged in
const user = getCurrentUser();
if (user) {
  socket.emit("register", user._id);
}

export default socket;
