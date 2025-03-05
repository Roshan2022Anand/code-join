import { useDispatch, useSelector } from "react-redux";
import { convertToFolder } from "../../utility/FolderConvertor";
import { FolderStructureType } from "../../utility/Types";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import {
  setOpenedFile,
  useLazyGetFileCodeQuery,
} from "../../redux/slices/FileSlice";
import { langExt } from "../../utility/languages";

const FilesOpt = () => {
  //global state from redux
  const dispatch = useDispatch();
  const { folderStructure, openedFile } = useSelector(
    (state: RootState) => state.file
  );
  const { roomID } = useSelector((state: RootState) => state.room);

  const [folderElement, setfolderElement] = useState<JSX.Element[]>([]);
  const [activeEle, setactiveEle] = useState("");
  const [getFileCode] = useLazyGetFileCodeQuery();

  //check if  openedFile exists in the folderStructure
  useEffect(() => {
    if (!openedFile || !folderStructure) return;

    const { root } = convertToFolder(folderStructure);
    const target = openedFile.split("/");

    const checkExistence = (i: number, parent: FolderStructureType) => {
      if (!parent[target[i]]) {
        dispatch(
          setOpenedFile({
            langObj: { name: "", runCmd: "" },
            openedFile: null,
            code: null,
          })
        );
        return;
      } else if (parent[target[i]] == "file") return;

      checkExistence(i + 1, parent[target[i]] as FolderStructureType);
    };

    checkExistence(0, root as FolderStructureType);
  }, [openedFile, folderStructure, dispatch]);

  useEffect(() => {
    //to handle the click on the file
    const handleFileClick = (fileName: string, loc: string) => {
      if (!roomID) return;

      const openedFile = `${loc}${fileName}`;
      setactiveEle(openedFile);
      const langObj = langExt[fileName.split(".").pop() as string] || {
        name: "plaintext",
        runCmd: "",
      };

      dispatch(setOpenedFile({ langObj, openedFile, code: null }));

      getFileCode({
        roomID,
        fileLoc: openedFile,
      });
    };

    //to convert the JS object to JSX elements
    const createElements = (folder: FolderStructureType, loc: string) => {
      const elements = [];
      for (const key in folder) {
        //if it is a file
        if (folder[key] == "file") {
          elements.push(
            <h4
              className={`file-txt ${
                activeEle === `${loc}${key}` && "bg-accent-400"
              }`}
              key={key}
              onClick={() => handleFileClick(key, loc)}
            >
              {key}
            </h4>
          );
        } else {
          //if it is a folder
          elements.push(
            <details key={key} className="ml-3">
              <summary
                className={`file-txt ${
                  activeEle === `${loc}${key}` && "bg-accent-400"
                }`}
                id={key}
                onClick={() => setactiveEle(`${loc}${key}`)}
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
    const { root } = convertToFolder(folderStructure);
    setfolderElement(createElements(root as FolderStructureType, ""));
  }, [folderStructure, activeEle, dispatch, roomID, getFileCode, openedFile]);

  return (
    <details className="size-full px-1" open>
      <summary className="border-b-2">root</summary>
      <pre>{folderElement}</pre>
    </details>
  );
};

export default FilesOpt;
