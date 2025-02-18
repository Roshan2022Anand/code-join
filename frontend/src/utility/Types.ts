import { IconType } from "react-icons";

//all RTK Query types
export type RunContArg = { containerID: string; code: string };
export type RunContRes = { output: string };
export type CreateContArg = { lang: string };
export type CreateContRes = { containerID: string; output: string[] };

export type LangIcon = {
  name: string;
  icon: IconType;
};

export type FolderStructureType = {
  [key: string]: "file" | FolderStructureType;
};