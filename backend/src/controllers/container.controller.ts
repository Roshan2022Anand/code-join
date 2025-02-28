import { Request, Response } from "express";
import { languages } from "../helpers/PrgLang";
import { langKey } from "../helpers/Types";
import docker from "../configs/Docker";

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
      Tty: true,
      WorkingDir: "/root",
      Cmd: [
        "bash",
        "-c",
        `echo '${language.code}' > main.${language.ext} && ls /root -R && exec bash`,
      ],
    });

    //attaching the container to the stream to get the output
    const stream = await container.attach({
      stream: true,
      stdin: true,
      stdout: true,
      stderr: true,
    });

    let output = "";
    stream.on("data", (data) => {
      output += data.toString();
      if (output !== "")
        res.status(200).json({ containerID: container.id, output });
    });

    await container.start();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//to read the container
export const GetContainer = async (req: Request, res: Response) => {
  try {
    const { containerID } = req.query;
    const container = docker.getContainer(containerID as string);
    const exec = await container.exec({
      Cmd: ["bash", "-c", "ls /root -R"],
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({ hijack: true, stdin: true });

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

export const GetFileCode = async (req: Request, res: Response) => {
  try {
    const { containerID, fileLoc } = req.query;
    const container = docker.getContainer(containerID as string);
    const exec = await container.exec({
      Cmd: ["cat", fileLoc as string],
      AttachStdout: true,
      AttachStderr: true,
    });
    const stream = await exec.start({ hijack: true, stdin: true });
    let output: string = "";
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
