import { Server, Socket } from "socket.io";
import { getIO, rooms } from "../configs/Socket";
import { runNonInteractiveCmd } from "./Container.service";

const TerminalOperations = (socket: Socket) => {
  const io = getIO();
  //to listen terminal input
  socket.on("terminal-input", ({ key, buffer, roomID }) => {
    io.to(roomID).emit("terminal-write", { key, buffer });
  });

  //to listen terminal run
  socket.on("terminal-run", ({ cmd, roomID }) => {
    const stream = rooms.get(roomID)!.streams[0];
    stream.write(cmd);
  });

  socket.on("stream-run", ({cmd,roomID,send}) => {
    runNonInteractiveCmd(socket, roomID, send, cmd);
  });
};

export default TerminalOperations;
