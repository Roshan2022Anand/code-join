import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const RoomOpt = () => {
  const { roomID } = useSelector((state: RootState) => state.room);
  return (
    <details>
      <summary>ID</summary>
      <p>{roomID}</p>
    </details>
  );
};

export default RoomOpt;
