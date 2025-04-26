import docker from "../configs/Docker";
import { languages } from "../helpers/PrgLang";
import { rooms } from "../configs/Socket";
import { Socket } from "socket.io";
import { langKey } from "../helpers/Types";

//to create a container
export const createContainer = async (
  lang: langKey,
  socket: Socket
): Promise<{ containerID?: string; code?: string }> => {
  try {
    const language = languages[lang as langKey];

    // Creating a container with proper command array
    let container = await docker.createContainer({
      Image: language.env,
      AttachStdin: true,
      AttachStdout: true,
      Tty: true,
      WorkingDir: "/root",
      Cmd: ["bash", "-c", `echo '${language.code}' > main && exec bash`],
    });

    await container.start();
    return { containerID: container.id, code: language.code };
  } catch (err) {
    return {};
  }
};

//to run a command in the container
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
