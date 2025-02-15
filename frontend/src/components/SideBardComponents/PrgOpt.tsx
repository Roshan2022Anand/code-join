import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { langIcons, languagesOpt } from "../../utility/languages";
import React, { useEffect, useState } from "react";
import {
  setContainerID,
  setCurrentLang,
  useCreateContainerMutation,
} from "../../redux/slices/TerminalSlice";
import { langKey } from "../../utility/Types";

const PrgOpt = () => {
  //global state from redux
  const dispatch = useDispatch();
  const { currentLang } = useSelector((state: RootState) => state.terminalS);

  const [language, setlanguage] = useState<string | null>(null);

  //function to handle language change
  const [createContainer, { isSuccess, data }] = useCreateContainerMutation();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setContainerID(data?.containerID));
      dispatch(
        setCurrentLang({
          name: language,
          code: languagesOpt[language as langKey].code,
        })
      );
    }
  }, [isSuccess, data, language, dispatch]);

  return (
    <>
      {langIcons.map(({ name, icon }) => {
        return (
          <button
            key={name}
            className="prg-opt-btn"
            onClick={() => {
              setlanguage(name);
              createContainer({ env: languagesOpt[name as langKey].env });
            }}
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
