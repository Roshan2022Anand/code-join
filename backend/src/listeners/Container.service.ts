import docker from "../configs/Docker";
import { getIO, rooms } from "../configs/Socket";
import { Socket } from "socket.io";
import { langKey, languages } from "../helpers/Types";
import Dockerode from "dockerode";
import internal from "stream";

//to create a container
export const createContainer = async (
  lang: langKey,
  roomID: string
): Promise<{
  containerID?: string;
  stream?: internal.Duplex;
  code?: string;
}> => {
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
        `echo '${language.code}' > main ${
          language.env == "node" && "&& npm i prompt-sync"
        } && exec bash`,
      ],
    });

    await container.start();
    const stream = await startStream(container, roomID);
    return { containerID: container.id, stream, code: language.code };
  } catch (err) {
    return {};
  }
};

//to start a stream for continuous output
export const startStream = async (
  container: Dockerode.Container,
  roomID: string
): Promise<internal.Duplex> => {
  const io = getIO();

  const exec1 = await container.exec({
    Cmd: ["bash"],
    AttachStdout: true,
    AttachStderr: true,
    AttachStdin: true,
    Tty: true,
  });

  const stream = await exec1.start({ hijack: true, stdin: true });

  stream.on("data", (data) => {
    const output = data.slice(8).toString();
    console.log("Container Output:", output);

    if (output.includes("root@"))
      io.to(roomID).emit("terminal-output", "\n---end of the program---");
    else io.to(roomID).emit("terminal-output", output);
  });

  // stream.on

  stream.on("end", () => {
    console.log("Container stream ended");
  });

  return stream;
};

//to run non interactive commands
export const runNonInteractiveCommand = async (
  code: string,
  roomID: string
) => {
  const containerID = rooms.get(roomID)?.containerID;
  const container = docker.getContainer(containerID as string);

  const exec = await container.exec({
    Cmd: ["bash", "-c", `echo '${code}' > main`],
    WorkingDir: "/root",
    AttachStdout: true,
    AttachStderr: true,
  });
  const stream = await exec.start({ hijack: true });
  stream.end();
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
