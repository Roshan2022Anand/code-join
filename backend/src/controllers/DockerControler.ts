import { Request, Response } from "express";
import Docker from "dockerode";
const docker = new Docker();

let container: Docker.Container;
// to create a container
export const CreateContainer = async (req: Request, res: Response) => {
  try {
    const { env } = req.body;
    if (container) container.kill();

    //creating a container
    container = await docker.createContainer({
      Image: env,
      AttachStdin: true,
      AttachStdout: true,
      HostConfig: {
        AutoRemove: true,
      },
      Tty: true,
    });
    container.start();

    res
      .status(200)
      .json({ message: "Container Created", containerID: container.id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//to run a program in the container
export const RunPrgContainer = async (req: Request, res: Response) => {
  try {
    const { containerID, code } = req.body;
    container = docker.getContainer(containerID);

    //executing the code
    const exec = await container.exec({
      Cmd: ["node", "-e", code],
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({ hijack: true, stdin: true });
    stream.on("data", (data) => {
      res
        .status(200)
        .json({ message: "Ran sucessfully", output: data.slice(8).toString() });
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

//to stop and remove the container
export const StopContainer = async (req: Request, res: Response) => {
  try {
    const { containerID } = req.body;
    container = docker.getContainer(containerID);
    await container.stop();
    await container.remove();
    res.status(200).json({ message: "Container stopped and removed" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};