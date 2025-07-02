import { useEffect, useRef, useState } from "react";
import { FaFile, FaUserFriends } from "react-icons/fa";
import { IoOptionsSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveSection,
  setEditorWidth,
} from "../../providers/redux/slices/editor";
import RoomOpt from "../SideBardComponents/RoomOpt";
import FilesOpt from "../SideBardComponents/FilesOpt";
import { setSideBarOpt } from "../../providers/redux/slices/file";
import { RootState } from "../../providers/redux/store";

const SideBar = () => {
  const dispatch = useDispatch();
  const { activeSection, editorWidth } = useSelector(
    (state: RootState) => state.editor
  );

  const { sideBarOpt } = useSelector((state: RootState) => state.file);

  const [sideW, setsideW] = useState(0);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sidebarRef.current) setsideW(sidebarRef.current.clientWidth);
  }, [editorWidth]);

  useEffect(() => {
    dispatch(setEditorWidth(window.innerWidth - (sideBarOpt ? 400 : 100)));
  }, [sideBarOpt, dispatch]);

  const handleOption = (opt: string | null) => {
    if (opt == sideBarOpt) opt = null;
    dispatch(setSideBarOpt(opt));
  };

  return (
    <aside
      ref={sidebarRef}
      className={`flex-1 flex flex-col h-full overflow-hidden rounded-md bg-secondary ${
        activeSection == "opt" && "border-4 border-accent-300"
      }`}
      onClick={() => dispatch(setActiveSection("opt"))}
    >
      <header className="bg-soft py-1 px-3 flex gap-3 items-center">
        <IoOptionsSharp className="icon-md" />
        {sideW > 150 && <h3>Options</h3>}
      </header>
      <section className="flex-1 flex">
        <aside className="w-[95px] flex flex-col p-3 gap-3 bg-soft">
          <button onClick={() => handleOption("fileopt")}>
            <FaFile className="icon-md-soft" />
          </button>
          <button onClick={() => handleOption("roomopt")}>
            <FaUserFriends className="icon-md-soft" />
          </button>
        </aside>
        {sideBarOpt && (
          <article className="flex-1 flex flex-col overflow-x-hidden">
            {sideBarOpt == "roomopt" && <RoomOpt />}
            {sideBarOpt == "fileopt" && <FilesOpt />}
          </article>
        )}
      </section>
    </aside>
  );
};

export default SideBar;
