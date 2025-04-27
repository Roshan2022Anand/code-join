import type * as Monaco from "monaco-editor";
import { FaPlay } from "react-icons/fa";
import useTerminalService from "../../sockets/TerminalSocket";
import { toast } from "react-toastify";

const RunBtn = ({
  editor,
}: {
  editor: Monaco.editor.IStandaloneCodeEditor | null;
}) => {
  const { runCode } = useTerminalService();

  //to run the program
  const handleRunPrg = () => {
    const code = editor?.getValue();
    if (code) {
      runCode(code);
    } else if (code === "") toast.error("Code is empty");
    else toast.error("choose a language or join a room");
  };

  return (
    <button className="mr-2" onClick={handleRunPrg}>
      <FaPlay className="icon-md" />
    </button>
  );
};

export default RunBtn;
