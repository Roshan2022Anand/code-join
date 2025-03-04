import { Socket } from "socket.io";

const EditorOperations = (socket: Socket) => {

  socket.on("editor-keypress", ({ range, text, roomID }) => {
    socket.to(roomID).emit("editor-content-update", { range, text });
  });
};

export default EditorOperations;
