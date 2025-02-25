import { IconType } from "react-icons";

//all RTK Query types
export type RunContArg = {
  containerID: string | null;
  cmd: string;
  WorkingDir: string;
};
export type outputRes = { output: string[] };
export type CreateContArg = { lang: string };
export type CreateContRes = { containerID: string; output: string[] };
export type getFileCodeArg = { containerID: string | null; fileLoc: string };
export type getFileCodeRes = { output: string };
export type LangIcon = {
  name: string;
  icon: IconType;
};

export type FolderStructureType = {
  [key: string]: "file" | FolderStructureType;
};
