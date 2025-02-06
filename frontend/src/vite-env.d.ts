import { IconType } from "react-icons";
/// <reference types="vite/client" />

export type LangIcon = {
  name: string;
  icon: IconType;
};

export type langKey =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "go"
  | "c"
  | "cpp";

export type LangInfoType = {
  env: string;
  code: string;
};
