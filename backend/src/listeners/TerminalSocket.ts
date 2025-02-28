import { Server, Socket } from "socket.io";
import docker from "../configs/Docker";
import { rooms } from "../configs/Socket";

const TerminalOperations = (socket: Socket, io: Server) => {
  //to listen terminal input
  socket.on("terminal-input", ({ key, buffer, roomID }) => {
    io.to(roomID).emit("terminal-write", { key, buffer });
  });

  //to listen terminal run
  socket.on("terminal-run", async ({ cmd, roomID, terminalLoc }) => {
    try {
      let container = docker.getContainer(rooms[roomID].containerID);

      const exec = await container.exec({
        Cmd: [
          "bash",
          "-c",
          `${cmd} && echo "_brk_" && pwd && echo "_brk_" && ls /root -R`,
        ],
        WorkingDir: terminalLoc,
        AttachStdout: true,
        AttachStderr: true,
      });

      const stream = await exec.start({ hijack: true, stdin: true });

      let output: string = "";
      stream
        .on("data", (data) => {
          // console.log(data.slice(8).toString());
          output += data.slice(8).toString();
        })
        .on("end", () => {
          // res.status(200).json({ output: output.split("_brk_\n") });
          io.to(roomID).emit("terminal-output", output.split("_brk_\n")[0]);
        });
    } catch (err) {
      console.log(err);
    }
  });
};

export default TerminalOperations;
