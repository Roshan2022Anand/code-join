import { FaJava, FaPython } from "react-icons/fa";
import { FaC, FaGolang } from "react-icons/fa6";
import { IoLogoJavascript } from "react-icons/io5";
import { SiTypescript } from "react-icons/si";
import { TbBrandCpp } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { langKey, languagesOpt } from "../../utility/languages";
import { setCurrentLang } from "../../redux/slices/EditorSlice";

export const ProgrammingOptions = () => {
  const dispatch = useDispatch();
  const { currentLang } = useSelector((state: RootState) => state.editor);
  const handleLanguageChange = (language: string) => {
    dispatch(
      setCurrentLang({
        name: language,
        code: languagesOpt[language as langKey],
      })
    );
  };

  return (
    <>
      <button
        className="prg-opt-btn"
        onClick={() => handleLanguageChange("javascript")}
      >
        <IoLogoJavascript className="icon-md-soft" />
        <h3 className={`${currentLang == "javascript" && "text-accent-700"} `}>
          Javascript
        </h3>
      </button>

      <button
        className="prg-opt-btn"
        onClick={() => handleLanguageChange("typescript")}
      >
        <SiTypescript className="icon-md-soft" />
        <h3 className={`${currentLang == "typescript" && "text-accent-700"} `}>
          Typescript
        </h3>
      </button>

      <button
        className="prg-opt-btn"
        onClick={() => handleLanguageChange("python")}
      >
        <FaPython className="icon-md-soft" />
        <h3 className={`${currentLang == "python" && "text-accent-700"} `}>
          Python
        </h3>
      </button>

      <button
        className="prg-opt-btn"
        onClick={() => handleLanguageChange("java")}
      >
        <FaJava className="icon-md-soft" />
        <h3 className={`${currentLang == "java" && "text-accent-700"} `}>
          Java
        </h3>
      </button>

      <button
        className="prg-opt-btn"
        onClick={() => handleLanguageChange("go")}
      >
        <FaGolang className="icon-md-soft" />
        <h3 className={`${currentLang == "go" && "text-accent-700"} `}>Go</h3>
      </button>

      <button className="prg-opt-btn" onClick={() => handleLanguageChange("c")}>
        <FaC className="icon-md-soft" />
        <h3 className={`${currentLang == "c" && "text-accent-700"} `}>
          C programming
        </h3>
      </button>

      <button
        className="prg-opt-btn"
        onClick={() => handleLanguageChange("cpp")}
      >
        <TbBrandCpp className="icon-md-soft" />
        <h3 className={`${currentLang == "cpp" && "text-accent-700"} `}>CPP</h3>
      </button>
    </>
  );
};

export const RoomOptions = () => {
  return (
    <>
      <div>Room</div>
    </>
  );
};
