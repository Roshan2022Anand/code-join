import { IoTerminal } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setActiveSection } from "../../redux/slices/EditorSlice";

const Terminal = () => {
  const dispatch = useDispatch();
  const { activeSection } = useSelector((state: RootState) => state.editor);
  const { containerOutput } = useSelector(
    (state: RootState) => state.terminalS
  );

  return (
    <article
      className={`flex-1 flex flex-col overflow-hidden rounded-md bg-secondary overflow-x-auto ${
        activeSection == "terminal" && "border-4 border-accent-300"
      }`}
      onClick={() => dispatch(setActiveSection("terminal"))}
    >

      <header className="bg-soft py-1 px-3 flex items-center gap-3">
        <IoTerminal className="icon-md" />
        <h3>Terminal</h3>
      </header>
      <pre className="grow overflow-x-auto py-1 px-3">{containerOutput}</pre>
    </article>
  );
};

export default Terminal;
