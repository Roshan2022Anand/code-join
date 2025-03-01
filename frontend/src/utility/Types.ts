import { IconType } from "react-icons";

//all RTK Query types
export type getFileCodeArg = { roomID: string; fileLoc: string };
export type getFileCodeRes = { output: string };

export type LangIcon = {
  name: string;
  icon: IconType;
};

export type FolderStructureType = {
  [key: string]: "file" | FolderStructureType;
};
