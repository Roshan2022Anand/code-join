import { Socket } from "socket.io";
import { getIO } from "../configs/Socket";
import { runContainer } from "./Container.service";

//all the events related to editor operations
const EditorOperations = (socket: Socket) => {
  const io = getIO();

  //event on editor content change
  socket.on("editor-keypress", ({ range, text, roomID, openedFile }) => {
    socket
      .to(roomID)
      .emit("editor-content-update", { range, text, openedFile });
  });

  //event to cache the editor content
  socket.on("set-member-content", ({ socketID, code, editorLang }) => {
    io.to(socketID).emit("set-editor-value", { code, editorLang });
  });

  //event to run the code
  socket.on("run-code", ({ code, roomID, send, lang }) => {
    runContainer(code, roomID, socket, lang);
  });
};

export default EditorOperations;
