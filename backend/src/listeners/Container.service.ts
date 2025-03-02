import internal from "stream";
import docker from "../configs/Docker";
import { languages } from "../helpers/PrgLang";
import { langKey } from "../helpers/Types";
import { getIO, rooms } from "../configs/Socket";
import { Socket } from "socket.io";

//funtion to create a container
export const createContainer = async (lang: langKey, socket: Socket) => {
  try {
    const language = languages[lang as langKey];

    //creating a container
    let container = await docker.createContainer({
      Image: language.env,
      AttachStdin: true,
      AttachStdout: true,
      Tty: true,
      WorkingDir: "/root",
    });
    await container.start();
    return { containerID: container.id };
  } catch (err) {
    return {};
  }
};

//function to run non interactive commands
export const runNonInteractiveCmd = async (
  socket: Socket,
  roomID: string,
  send: boolean,
  cmd?: string
) => {
  const io = getIO();
  console.log("roomID", roomID);
  const container = docker.getContainer(rooms.get(roomID)!.containerID);

  //to send folder details
  if (send) {
    const exec = await container.exec({
      Cmd: ["bash", "-c", "ls /root -R"],
      AttachStdout: true,
      AttachStderr: true,
    });
    const stream = await exec.start({ hijack: true });
    stream.on("data", (data) => {
      io.to(roomID).emit("folder-details", data.slice(8).toString());
    });
  }

  //if cmd is passed then only run the command no need of strea
  if (cmd) {
    const exec = await container.exec({
      Cmd: ["bash", "-c", cmd],
      AttachStdout: true,
      AttachStderr: true,
    });
    const stream = await exec.start({ hijack: true });
    stream.end();
  }

  //test
  if (rooms.get(roomID)!.streams.length === 0) createNewStream(socket, roomID);
};

//function to create a new stream for the terminal
export const createNewStream = async (socket: Socket, roomID: string) => {
  const io = getIO();
  const container = docker.getContainer(rooms.get(roomID)?.containerID!);

  const exec1 = await container.exec({
    Cmd: ["bash"],
    AttachStdout: true,
    AttachStderr: true,
    AttachStdin: true,
    Tty: true,
  });

  const stream = await exec1.start({ hijack: true, stdin: true });

  stream.on("data", (data) => {
    const output: string = data.slice(8).toString();
    // if (!output.includes(cmd.trim()) || output.includes("bash:")) {
    io.to(roomID).emit("terminal-output", "\r\n" + data.slice(8).toString());
    // }
  });
  rooms.get(roomID)!.streams.push(stream);
};

//to stop and remove the container
export const StopContainer = async (containerID: string) => {
  try {
    let container = docker.getContainer(containerID);
    await container.stop();
    await container.remove();
  } catch (err) {
    console.log(err);
  }
};
