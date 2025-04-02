import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FaCopy } from "react-icons/fa";
import ChatBox from "./ChatBox";
import { toast } from "react-toastify";

const RoomOpt = () => {
  const { roomID } = useSelector((state: RootState) => state.room);
  const handleIdCopy = () => {
    navigator.clipboard.writeText(roomID as string).then(() => {
      toast.success("Room ID copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy Room ID");
    });
  };
  return (
    <section className="flex flex-col h-full">
      <figure
        className="flex items-center justify-between px-3 border-b-2 "
        onClick={handleIdCopy}
      >
        <p>Room ID</p>
        <button>
          <FaCopy className="text-accent-500 icon-sm" />
        </button>
      </figure>
      <ChatBox />
    </section>
  );
};

export default RoomOpt;
