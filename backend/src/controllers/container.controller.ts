import { Request, Response } from "express";
import docker from "../configs/Docker";
import { rooms } from "../configs/Socket";

export const GetFileCode = async (req: Request, res: Response) => {
  try {
    const { roomID, fileLoc } = req.query;
    const containerID = rooms.get(roomID as string)!.containerID;
    const container = docker.getContainer(containerID);
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