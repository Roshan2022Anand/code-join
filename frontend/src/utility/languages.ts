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
  py:{
    name: "python",
    runCmd: "python",
  },
  java: {
    name: "java",
    runCmd: "java",
  },
  go: {
    name: "go",
    runCmd: "go run",
  },
  c: {
    name: "c",
    runCmd: "gcc main.c -o main && ./main",
  },
};