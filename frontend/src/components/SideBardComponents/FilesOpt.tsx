import { convertToFolder } from "../../utility/FolderConvertor";
import { FolderStructureType } from "../../utility/Types";

const FilesOpt = () => {
  const folder =
    ".:\nserver.js\nconfig\npublic\nsrc\n\n./config:\ndb.json\napp.config.js\n\n./public:\ncss\njs\nindex.html\n\n./public/css:\nstyles.css\n\n./public/js:\nmain.js\nvendor.js\n\n./src:\ncontrollers\nmodels\nviews\n\n./src/controllers:\nhomeController.js\nuserController.js\n\n./src/models:\nuser.js\npost.js\n\n./src/views:\nhome.html\nuser.html\n";

  const folderObj = convertToFolder(folder);

  const createElements = (folder: FolderStructureType) => {
    const elements = [];
    for (const key in folder) {
      if (folder[key] == "file") {
        elements.push(
          <p className="ml-3 hover:bg-[#FFFFFF15]" key={key}>
            {key}
          </p>
        );
      } else {
        elements.push(
          <details key={key} className="w-fit ml-3">
            <summary className="hover:bg-[#FFFFFF15]">{key}</summary>
            <pre>{createElements(folder[key] as FolderStructureType)}</pre>
          </details>
        );
      }
    }
    return elements;
  };

  return (
    <details className="size-full">
      <summary className="border-b-2">root</summary>
      <pre>{createElements(folderObj)}</pre>
    </details>
  );
};

export default FilesOpt;
