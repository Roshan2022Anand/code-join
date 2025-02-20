import { FaJava, FaNodeJs, FaPython } from "react-icons/fa";
import { LangIcon } from "./Types";
import { FaC, FaGolang } from "react-icons/fa6";
import { TbBrandCpp } from "react-icons/tb";

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
export const langExt: Record<string, string> = {
  js: "javascript",
  py: "python",
  txt: "plaintext",
  java: "java",
  go: "go",
  c: "c",
};
