import { useSelector } from "react-redux";
import { convertToFolder } from "../../utility/FolderConvertor";
import { FolderStructureType } from "../../utility/Types";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";

const FilesOpt = () => {
  const { folderStructure } = useSelector(
    (state: RootState) => state.terminalS
  );

  const [folderElement, setfolderElement] = useState<JSX.Element[]>([]);
  const [activeEle, setactiveEle] = useState("main.js");
  

  useEffect(() => {
    //to convert the JS object to JSX elements
    const createElements = (folder: FolderStructureType) => {
      const elements = [];
      for (const key in folder) {
        if (folder[key] == "file") {
          elements.push(
            <h4
              className={`file-txt ${activeEle === key && "bg-accent-400"}`}
              key={key}
              onClick={() => setactiveEle(key)}
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
              <pre>{createElements(folder[key] as FolderStructureType)}</pre>
            </details>
          );
        }
      }
      return elements;
    };

    if (!folderStructure) return;
    setfolderElement(createElements(convertToFolder(folderStructure)));
  }, [folderStructure, activeEle]);

  return (
    <details className="size-full px-1" open>
      <summary className="border-b-2">root</summary>
      <pre>{folderElement}</pre>
    </details>
  );
};

export default FilesOpt;