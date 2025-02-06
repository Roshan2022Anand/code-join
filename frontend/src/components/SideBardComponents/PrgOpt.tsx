import { FaPython } from "react-icons/fa";
// import { FaC, FaGolang } from "react-icons/fa6";
import { IoLogoJavascript } from "react-icons/io5";
// import { SiTypescript } from "react-icons/si";
// import { TbBrandCpp } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { languagesOpt } from "../../utility/languages";
import { setCurrentLang } from "../../redux/slices/EditorSlice";
import React from "react";
import axios from "axios";
import { setContainerID } from "../../redux/slices/TerminalSlice";
import { LangIcon, langKey } from "../../vite-env";

const langIcons: LangIcon[] = [
  {
    name: "javascript",
    icon: IoLogoJavascript,
  },
  // {
  //   name: "typescript",
  //   icon: SiTypescript,
  // },
  {
    name: "python",
    icon: FaPython,
  },
  // {
  //   name: "java",
  //   icon: FaJava,
  // },
  // {
  //   name: "go",
  //   icon: FaGolang,
  // },
  // {
  //   name: "c",
  //   icon: FaC,
  // },
  // {
  //   name: "cpp",
  //   icon: TbBrandCpp,
  // },
];

const PrgOpt = () => {
  const dispatch = useDispatch();
  const { currentLang } = useSelector((state: RootState) => state.editor);

  //function to handle language change
  const handleLanguageChange = (language: string) => {
    //api to create a container
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/container`, {
        env: languagesOpt[language as langKey].env,
      })
      .then((res) => {
        const data = JSON.stringify(res.data);
        console.log(data);
        dispatch(setContainerID(res.data.containerID));
            dispatch(
              setCurrentLang({
                name: language,
                code: languagesOpt[language as langKey].code,
              })
            );
      }).catch((err) => {
        console.log(err);

      });
  };

  return (
    <>
      {langIcons.map(({ name, icon }) => {
        return (
          <button
            key={name}
            className="prg-opt-btn"
            onClick={() => handleLanguageChange(name)}
          >
            {React.createElement(icon, { className: "icon-md-soft" })}
            <h3 className={`${currentLang == name && "text-accent-700"} `}>
              {name}
            </h3>
          </button>
        );
      })}
    </>
  );
};

export default PrgOpt;
