import { useDispatch, useSelector } from "react-redux";
import { convertToFolder } from "../../utility/FolderConvertor";
import { FolderStructureType } from "../../utility/Types";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { setCurrentLang } from "../../redux/slices/TerminalSlice";
import { langExt } from "../../utility/languages";

const FilesOpt = () => {
  const dispatch = useDispatch();
  const { folderStructure } = useSelector(
    (state: RootState) => state.terminalS
  );

  const [folderElement, setfolderElement] = useState<JSX.Element[]>([]);
  const [activeEle, setactiveEle] = useState("main.js");

  useEffect(() => {
    //to handle the click on the file
    const handleFileClick = (fileName: string, loc: string) => {
      console.log(`node ${loc}${fileName}`);
      setactiveEle(fileName);
      const lang = langExt[fileName.split(".").pop() as string] || "txt";
      dispatch(setCurrentLang(lang));
    };

    //to convert the JS object to JSX elements
    const createElements = (folder: FolderStructureType, loc: string) => {
      const elements = [];
      for (const key in folder) {
        if (folder[key] == "file") {
          elements.push(
            <h4
              className={`file-txt ${activeEle === key && "bg-accent-400"}`}
              key={key}
              onClick={() => handleFileClick(key, loc)}
            >
              {key}
            </h4>
          );
        } else {
          elements.push(
            <details key={key} className="ml-3">
              <summary
                className={`file-txt ${activeEle === key && "bg-accent-400"}`}
                id={key}
                onClick={() => setactiveEle(key)}
              >
                {key}
              </summary>
              <pre>
                {createElements(
                  folder[key] as FolderStructureType,
                  `${loc}${key}/`
                )}
              </pre>
            </details>
          );
        }
      }
      return elements;
    };

    if (!folderStructure) return;
    setfolderElement(createElements(convertToFolder(folderStructure), ""));
  }, [folderStructure, activeEle, dispatch]);

  return (
    <details className="size-full px-1" open>
      <summary className="border-b-2">root</summary>
      <pre>{folderElement}</pre>
    </details>
  );
};

export default FilesOpt;
