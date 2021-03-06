import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";

const token = localStorage.getItem("messenger-token");
const socket = io(window.location.origin, {query: {token: token}});


socket.on("connect", () => {
  console.log("connected to server");
  // socket.on("session", ({ sessionID, userID }) => {
  //   // attach the session ID to the next reconnection attempts
  //   socket.auth = { sessionID };
  //
  //   // save the ID of the user
  //   socket.userID = userID;
  // });

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
  });
});

export default socket;
