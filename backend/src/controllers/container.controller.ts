import { Request, Response } from "express";
import Docker from "dockerode";
import { languages } from "../helpers/PrgLang";
import { langKey } from "../helpers/Types";
const docker = new Docker();

// to create a container
export const CreateContainer = async (req: Request, res: Response) => {
  try {
    const { lang } = req.body;
    const language = languages[lang as langKey];

    //creating a container
    let container = await docker.createContainer({
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
        `echo '${language.code}' > main.${language.ext} && ls -R && cat main.${language.ext} && exec bash`,
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
      if (output.length === 3)
        res.status(200).json({ containerID: container.id, output });
    });

    await container.start();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const TestContainer = async (req: Request, res: Response) => {
  console.log("Test Container");
  try {
    const { containerID } = req.body;
    const container = docker.getContainer(containerID);

    const exec = await container.exec({
      Cmd: ["bash", "-c", "pwd && ls -R && cat main.js"],
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({ hijack: true, stdin: true });

    let output: string[] = [];
    stream.on("data", (data) => {
      output.push(data.slice(8).toString());
      if (output.length === 3) {
        res.status(200).json({ output });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//to run a program in the container
export const RunContainer = async (req: Request, res: Response) => {
  console.log("Run Container");
  try {
    const { containerID, cmd } = req.body;
    let container = docker.getContainer(containerID);
    const exce = await container.exec({
      Cmd: cmd,
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exce.start({ hijack: true, stdin: true });

    let output = "";
    stream
      .on("data", (data) => {
        output += data.slice(8).toString();
      })
      .on("end", () => {
        res.status(200).json({ output });
      });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//to stop and remove the container
export const StopContainer = async (req: Request, res: Response) => {
  try {
    const { containerID } = req.body;
    let container = docker.getContainer(containerID);
    await container.kill();
    console.log("Container Stopped");
    res.status(200).json({ message: "Container stopped and removed" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
