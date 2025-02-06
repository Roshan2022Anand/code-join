import { useEffect, useRef, useState } from "react";
import { FaLaptopCode, FaUserFriends } from "react-icons/fa";
import { IoOptionsSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  setActiveSection,
  setEditorWidth,
  setSideBarOpt,
} from "../../redux/slices/EditorSlice";
import RoomOpt from "../SideBardComponents/RoomOpt";
import PrgOpt from "../SideBardComponents/PrgOpt";

const SideBar = () => {
  const dispatch = useDispatch();
  const { activeSection, editorWidth, sideBarOpt } = useSelector(
    (state: RootState) => state.editor
  );

  // const [sideBarOpt, setsideBarOpt] = useState<React.JSX.Element | null>(null);
  const [sideW, setsideW] = useState(0);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sidebarRef.current) setsideW(sidebarRef.current.clientWidth);
  }, [editorWidth]);

  useEffect(() => {
    dispatch(setEditorWidth(window.innerWidth - (sideBarOpt ? 400 : 100)));
  }, [sideBarOpt, dispatch]);

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
      <section className="flex-1 flex gap-2">
        <aside className="w-[95px] flex flex-col p-3 gap-3 bg-soft">
          <button onClick={() => dispatch(setSideBarOpt("prgopt"))}>
            <FaLaptopCode className="icon-md-soft" />
          </button>
          <button onClick={() => dispatch(setSideBarOpt("roomopt"))}>
            <FaUserFriends className="icon-md-soft" />
          </button>
        </aside>
        {sideBarOpt && (
          <article className="flex-1 flex flex-col p-3">
            {sideBarOpt == "prgopt" && <PrgOpt />}
            {sideBarOpt == "roomopt" && <RoomOpt />}
          </article>
        )}
      </section>
    </aside>
  );
};

export default SideBar;
