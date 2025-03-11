import { FolderStructureType } from "./Types";

export const convertToFolder = (folder: string): FolderStructureType => {
  const folderStruct: FolderStructureType = {
    root: {},
  };
  const filteredFolder = folder
    .split("\n")
    .map((item) => {
      if (item[0] == "/") item = item.replace(":", "");
      return item;
    })
    .filter((item) => item !== "");

  const setFolder = (k: number, parent: FolderStructureType) => {
    if (k >= filteredFolder.length) return;
    for (let i = k; i < filteredFolder.length; i++) {
      if (filteredFolder[i].includes("/")) {
        const structure = filteredFolder[i].split("/");
        parent = folderStruct;
        for (let j = 1; j < structure.length; j++) {
          if (parent[structure[j]] == "file") parent[structure[j]] = {};
          parent = parent[structure[j]] as FolderStructureType;
        }
        setFolder(i + 1, parent);
        return;
      }
      parent[filteredFolder[i]] = "file";
    }
  };
  
  setFolder(0, folderStruct);
  return folderStruct;
};
