import { FaLaptopCode } from "react-icons/fa";
import { GrConnect } from "react-icons/gr";
import useRoomServices from "../../sockets/Room";
import { useRef } from "react";

const RoomJoin = () => {
  const roomID = useRef<HTMLInputElement>(null);

  const { joinRoom } = useRoomServices();

  const handleRoomJoin = () => {
    const roomIDValue = roomID.current?.value;
    if (roomIDValue) {
      joinRoom(roomIDValue);
    }
  };

  return (
    <>
      <FaLaptopCode className="icon-lg" />
      <p className="text-accent-700">choose a language</p>
      <p className="text-accent-700">or</p>
      <figure className="flex rounded-md overflow-hidden">
        <input
          ref={roomID}
          type="text"
          placeholder="Enter room ID"
          className="outline-none text-black font-bold bg-accent-900 px-2"
        />
        <button
          className="bg-accent-200 px-2 py-1 button "
          onClick={handleRoomJoin}
        >
          <GrConnect className="icon-md" />
        </button>
      </figure>
    </>
  );
};

export default RoomJoin;
