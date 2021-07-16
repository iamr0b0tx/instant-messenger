import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";

// const socket = io(window.location.origin);
const socket = io(window.location.origin);

const sessionID = localStorage.getItem("sessionID");

if (sessionID) {
  this.usernameAlreadySelected = true;
  socket.auth = { sessionID };
  socket.connect();
}

// function destroyed() {
//   socket.off("connect_error");
// }

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
      this.usernameAlreadySelected = false;
    }
  });

  socket.on("session", ({ sessionID, userID }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };

    // store it in the localStorage
    localStorage.setItem("sessionID", sessionID);

    // save the ID of the user
    socket.userID = userID;
  });

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
