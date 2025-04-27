import docker from "../configs/Docker";
import { getIO, rooms } from "../configs/Socket";
import { Socket } from "socket.io";
import { langKey, languages } from "../helpers/Types";

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

//to run the container
export const runContainer = async (
  code: string,
  roomID: string,
  socket: Socket,
  lang: langKey
) => {
  try {
    const io = getIO();
    const containerID = rooms.get(roomID)?.containerID;
    const container = docker.getContainer(containerID as string);

    const runCmd = languages[lang as langKey].runCmd;
    const Cmd = [
      "bash",
      "-c",
      `echo '${code}' > main && ${runCmd}`,
    ];

    //executing the command in the container
    const exec = await container.exec({
      AttachStdout: true,
      AttachStderr: true,
      Cmd,
      WorkingDir: "/root",
    });

    const stream = await exec.start({
      hijack: true,
      stdin: true,
    });

    let output = "";
    stream.on("data", (data: Buffer) => {
      output += data.toString();
    });
    stream.on("end", () => {
      io.to(roomID).emit("terminal-output", output);
    });
  } catch (err) {
    console.log("Error in running container:", err);
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
