import { FaJava, FaNodeJs, FaPython } from "react-icons/fa";
import { LangIcon } from "./Types";
import { FaC, FaGolang } from "react-icons/fa6";
import { TbBrandCpp } from "react-icons/tb";

//icons for languages
export const langIcons: LangIcon[] = [
  {
    name: "NodeJS",
    icon: FaNodeJs,
  },
  {
    name: "python",
    icon: FaPython,
  },
  {
    name: "java",
    icon: FaJava,
  },
  {
    name: "go",
    icon: FaGolang,
  },
  {
    name: "c",
    icon: FaC,
  },
  {
    name: "cpp",
    icon: TbBrandCpp,
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