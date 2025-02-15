import { IconType } from "react-icons";

//all RTK Query types
export type RunContArg = { containerID: string; code: string };
export type RunContRes = { output: string };
export type CreateContArg = { env: string };
export type CreateContRes = { containerID: string };

export type LangIcon = {
  name: string;
  icon: IconType;
};

export type langKey = "javascript" | "python" | "java" | "go" | "c" | "cpp";

export type LangInfoType = {
  env: string;
  code: string;
};
