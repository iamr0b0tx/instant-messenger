import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";

// const socket = io(window.location.origin);
const socket = io(window.location.origin);

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
