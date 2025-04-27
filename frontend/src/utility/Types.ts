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
};

//icons for languages
export const LangIcons: LangIcon[] = [
  {
    name: "javascript",
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