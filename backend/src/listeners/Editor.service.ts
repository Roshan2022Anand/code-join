import { Socket } from "socket.io";
import { getIO, rooms } from "../configs/Socket";
import { GetFileCode } from "./Container.service";

const EditorOperations = (socket: Socket) => {
  const io = getIO();
  socket.on("editor-keypress", ({ range, text, roomID, openedFile }) => {
    socket
      .to(roomID)
      .emit("editor-content-update", { range, text, openedFile });
  });

  socket.on("set-member-content", ({ socketID, code, editorLang }) => {
    io.to(socketID).emit("set-editor-value", {code, editorLang });
  });
};

export default EditorOperations;
