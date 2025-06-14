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

  socket.on("get-file-content", ({ roomID, openedFile }) => {
    let cache = false;
    const members = rooms.get(roomID)!.members;

    //to check if other members are using the same file
    for (let [key, value] of members) {
      if (value.currFile == openedFile) {
        io.to(key).emit("get-member-content", socket.id);
        cache = true;
        break;
      }
    }

    if (!cache) {
      GetFileCode(roomID, openedFile, socket);
    }
    members.get(socket.id)!.currFile = openedFile;
  });

  socket.on("set-member-content", ({ socketID, code }) => {
    io.to(socketID).emit("set-editor-value", code);
  });
};

export default EditorOperations;
