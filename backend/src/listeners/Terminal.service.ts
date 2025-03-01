import { Server, Socket } from "socket.io";
import { rooms } from "../configs/Socket";

const TerminalOperations = (socket: Socket, io: Server) => {
  //to listen terminal input
  socket.on("terminal-input", ({ key, buffer, roomID }) => {
    io.to(roomID).emit("terminal-write", { key, buffer });
  });

  //to listen terminal run
  socket.on("terminal-run", async ({ cmd, roomID }) => {
    try {
      const stream = rooms[roomID].streams["terminal1"];

      stream.write(cmd);
      stream.removeAllListeners("data");
      stream.on("data", (data) => {
        const output: string = data.slice(8).toString();

        if (!output.includes(cmd.trim())) {
          io.to(roomID).emit(
            "terminal-output",
            "\r\n" + data.slice(8).toString()
          );
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
};

export default TerminalOperations;