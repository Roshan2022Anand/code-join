import { Socket } from "socket.io";
import { getIO, rooms } from "../configs/Socket";
import { runNonInteractiveCommand } from "./Container.service";
import { langKey, languages } from "../helpers/Types";

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
  socket.on("run-code", async ({ code, roomID, lang }) => {
    const stream = rooms.get(roomID)?.stream;
    if (!stream) {
      socket.emit("error", "Internal error");
      return;
    }

    await runNonInteractiveCommand(code, roomID); //to save the code in the container

    const runCmd = languages[lang as langKey].runCmd;
    stream.write(runCmd);
  });

  //evnt to enter the terminal input
  socket.on("terminal-input", ({ roomID, input }) => {
    const stream = rooms.get(roomID)?.stream;
    if (!stream) {
      socket.emit("error", "Internal error");
      return;
    }

    stream.write(input);
  });
};

export default EditorOperations;
