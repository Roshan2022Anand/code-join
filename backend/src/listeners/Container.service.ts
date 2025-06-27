import docker from "../configs/Docker";
import { languages } from "../helpers/PrgLang";
import { getIO, rooms } from "../configs/Socket";
import { Socket } from "socket.io";
import { langKey } from "../helpers/Types";

//funtion to create a container
export const createContainer = async (lang: langKey, socket: Socket) => {

  try {
    const language = languages[lang as langKey];

    // Creating a container with proper command array
    let container = await docker.createContainer({
      Image: language.env,
      AttachStdin: true,
      AttachStdout: true,
      Tty: true,
      WorkingDir: "/root",
      Cmd: [
        "bash",
        "-c",
        `echo '${language.code}' > main.${language.ext} && exec bash`,
      ],
      Env: ["PORT=9090"],
      ExposedPorts: {
        "9090/tcp": {},
      },
      HostConfig: {
        PortBindings: {
          "9090/tcp": [
            {
              HostPort: "9090",
            },
          ],
        },
      },
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
  const container = docker.getContainer(rooms.get(roomID)!.containerID);

  //to send folder details
  if (send) {
    const exec = await container.exec({
      Cmd: ["bash", "-c", "ls /root -R"],
      AttachStdout: true,
      AttachStderr: true,
    });
    const stream = await exec.start({ hijack: true });
    let output = "";
    stream.on("data", (data) => {
      output += data.slice(8).toString();
    });
    stream.on("end", () => {
      io.to(roomID).emit("folder-details", output);
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

  // test
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
    io.to(roomID).emit("terminal-output", data.slice(8).toString());
  });
  rooms.get(roomID)!.streams.push(stream);
};

export const GetFileCode = async (
  roomID: string,
  fileLoc: string,
  socket: Socket
) => {
  try {
    const containerID = rooms.get(roomID as string)!.containerID;
    const container = docker.getContainer(containerID);
    const exec = await container.exec({
      Cmd: ["cat", fileLoc as string],
      AttachStdout: true,
      AttachStderr: true,
    });
    const stream = await exec.start({ hijack: true });
    let output: string = "";
    stream
      .on("data", (data) => {
        output += data.slice(8).toString();
      })
      .on("end", () => {
        socket.emit("set-editor-value", output);
      });
  } catch (err) {
    console.log(err);
    socket.emit("error", "Error in getting file content, please try again");
  }
};

//to stop and remove the container
export const StopContainer = async (containerID: string) => {
  try {
    let container = docker.getContainer(containerID);
    await container.stop();
    await container.remove();
    console.log("Container stopped and removed");
  } catch (err) {
    console.log(err);
  }
};
