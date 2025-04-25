import { IconType } from "react-icons";
import { FaJava, FaNodeJs, FaPython } from "react-icons/fa";
import { FaC, FaGolang } from "react-icons/fa6";
import { TbBrandCpp } from "react-icons/tb";

//all RTK Query types
export type getFileCodeArg = { roomID: string; fileLoc: string };
export type getFileCodeRes = { output: string };

export type LangIcon = {
  name: string;
  icon: IconType;
  runCmd: string;
};

export type FolderStructureType = {
  [key: string]: "file" | FolderStructureType;
};

//icons for languages
export const LangIcons: LangIcon[] = [
  {
    name: "javascript",
    icon: FaNodeJs,
    runCmd: "node",
  },
  {
    name: "python",
    icon: FaPython,
    runCmd: "python",
  },
  {
    name: "java",
    icon: FaJava,
    runCmd: "java",
  },
  {
    name: "go",
    icon: FaGolang,
    runCmd: "go run",
  },
  {
    name: "c",
    icon: FaC,
    runCmd: "gcc",
  },
  {
    name: "cpp",
    icon: TbBrandCpp,
    runCmd: "g++",
  },
];

//languages to set for monaco editor
export const langExt: Record<string, { name: string; runCmd: string }> = {
  js: {
    name: "javascript",
    runCmd: "node",
  },
  py: {
    name: "python",
    runCmd: "python",
  },
  c: {
    name: "c",
    runCmd: "gcc", // typically you'd compile with gcc then run the output binary
  },
  cpp: {
    name: "cpp",
    runCmd: "g++", // similarly, compile with g++ then run the binary
  },
  java: {
    name: "java",
    runCmd: "java", // usually compile with javac first, then run with java
  },
  go: {
    name: "go",
    runCmd: "go run", // go supports running the file directly with go run
  },
  json: {
    name: "json",
    runCmd: "", // JSON files are data and don't have a run command
  },
  md: {
    name: "markdown",
    runCmd: "", // Markdown is not executable
  },
};
