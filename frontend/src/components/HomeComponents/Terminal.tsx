import { IoTerminal } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveSection } from "../../redux/slices/EditorSlice";

const Terminal = () => {
  const dispatch = useDispatch();
  const { activeSection } = useSelector((state: RootState) => state.editor);

  return (
    <article
      className={`grow overflow-hidden rounded-md bg-secondary ${
        activeSection == "terminal" && "border-4 border-accent-300"
      }`}
      onClick={() => dispatch(setActiveSection("terminal"))}
    >
      <header className="bg-soft py-1 px-3 flex items-center gap-3">
        <IoTerminal className="icon-md" />
        <h3>Terminal</h3>
      </header>
    </article>
  );
};

export default Terminal;
