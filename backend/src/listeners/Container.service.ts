import internal from "stream";
import docker from "../configs/Docker";
import { languages } from "../helpers/PrgLang";
import { langKey } from "../helpers/Types";
import { rooms } from "../configs/Socket";
import { Socket } from "socket.io";

export const createContainer = async (
  lang: langKey
): Promise<{
  containerID?: string;
  stream?: internal.Duplex;
}> => {
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

    const execOpt = {
      AttachStdout: true,
      AttachStderr: true,
      AttachStdin: true,
      Tty: true,
    };

    //executing the container
    const exec = await container.exec({
      Cmd: [
        "bash",
        "-c",
        `echo '${language.code}' > main.${language.ext} && exec bash`,
      ],
      ...execOpt,
    });

    const stream = await exec.start({ hijack: true, stdin: true });
    return { containerID: container.id, stream };
  } catch (err) {
    return {};
  }
};

//function to send container details
export const sendContainerDetails = async (socket: Socket, roomID: string) => {
  const container = docker.getContainer(rooms[roomID].containerID);
  const exec = await container.exec({
    Cmd: ["bash", "-c", "ls /root -R"],
    AttachStdout: true,
    AttachStderr: true,
  });
  const stream = await exec.start({ hijack: true });

  stream.on("data", (data) => {
    console.log(data.slice(8).toString());
    socket.emit("folder-details", data.slice(8).toString());
  });
};

//to stop and remove the container
export const StopContainer = async (containerID: string) => {
  try {
    let container = docker.getContainer(containerID);
    await container.stop();
    await container.remove();
    console.log("Container Stopped");
  } catch (err) {
    console.log(err);
  }
};
