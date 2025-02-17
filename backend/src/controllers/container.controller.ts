import { Request, Response } from "express";
import Docker from "dockerode";
import { languages } from "../helpers/PrgLang";
import { langKey } from "../helpers/Types";
const docker = new Docker();

let container: Docker.Container;
// to create a container
export const CreateContainer = async (req: Request, res: Response) => {
  try {
    const { lang } = req.body;
    const language = languages[lang as langKey];

    //creating a container
    container = await docker.createContainer({
      Image: language.env,
      AttachStdin: true,
      AttachStdout: true,
      HostConfig: {
        AutoRemove: true,
      },
      Tty: true,
      WorkingDir: "/root",
      Cmd: [
        "bash",
        "-c",
        `echo '${language.code}' > main.${language.ext} && ls -r && cat main.${language.ext} && exec bash`,
      ],
    });

    //attaching the container to the stream to get the output
    const stream = await container.attach({
      stream: true,
      stdin: true,
      stdout: true,
      stderr: true,
    });

    let output: string[] = [];
    stream.on("data", (data) => {
      output.push(data.toString());
    });

    await container.start();

    res.status(200).json({ containerID: container.id, output });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//to run a program in the container
export const RunContainer = async (req: Request, res: Response) => {
  try {
    const { containerID, code } = req.body;
    container = docker.getContainer(containerID);
    console.log(code);
    const exce = await container.exec({
      Cmd: ["node", "-e", code],
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exce.start({ hijack: true, stdin: true });

    let output = "";
    stream.on("data", (data) => {
      console.log(data);
      output += data.slice(8).toString();
    });

    stream.on("end", () => {
      console.log(output);
      res.status(200).json({ output });
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
