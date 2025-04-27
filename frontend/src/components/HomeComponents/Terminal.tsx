import { IoTerminal } from "react-icons/io5";
import { setActiveSection } from "../../redux/slices/EditorSlice";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Terminal = () => {
  const dispatch = useDispatch();
  const { activeSection } = useSelector((state: RootState) => state.editor);
  const { terminalOutput } = useSelector((state: RootState) => state.file);

  return (
    <article
      className={`flex-1 flex flex-col overflow-hidden rounded-md bg-secondary border-4 border-soft ${
        activeSection == "terminal" && "border-4 border-accent-300"
      }`}
      onClick={() => dispatch(setActiveSection("terminal"))}
    >
      <header className="bg-soft py-2 px-3 flex items-center gap-3">
        <IoTerminal className="icon-md" />
        <h3>Terminal</h3>
        <button className="ml-auto">
          <FaPlus className="icon-md" />
        </button>
      </header>
      <section className="flex-1 bg-black">{terminalOutput}</section>
    </article>
  );
};

export default Terminal;
