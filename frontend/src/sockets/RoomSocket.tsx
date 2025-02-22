import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { useMyContext } from "../utility/MyContext";
import { setRoomID } from "../redux/slices/RoomSlice";
import { setContainerID } from "../redux/slices/TerminalSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RoomServices = () => {
  const navigate = useNavigate();

  //gloabl state from redux
  const dispatch = useDispatch();
  const { userName, profile } = useSelector((state: RootState) => state.room);
  const { containerID } = useSelector((state: RootState) => state.terminalS);

  //socket from context
  const { socket } = useMyContext();

  //listen room events
  useEffect(() => {
    if (!socket) return;

    //listen room-created event
    socket.on("room-created", (roomID) => {
      dispatch(setRoomID(roomID));
      navigate("/home");
    });

    //listen room-joined event
    socket.on("room-joined", ({ roomID, containerID }) => {
      dispatch(setRoomID(roomID));
      dispatch(setContainerID(containerID));
      navigate("/home");
    });

    //listen error event
    socket.on("error", (msg) => {
      toast.error(msg);
    });
  }, [socket, dispatch, navigate]);

  //to join a room
  const joinRoom = (roomID: string) => {
    socket?.emit("join-room", { roomID, name: userName, profile });
  };

  //to create a room
  const createRoom = () => {
    //generate a room id using crypto
    const array = new Uint8Array(length / 2);
    window.crypto.getRandomValues(array);
    const id = Array.from(array, (dec) => dec.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, length);

    //emit create-room event
    socket?.emit("create-room", {
      roomID: id,
      name: userName,
      profile,
      containerID: containerID,
    });
  };

  return { joinRoom, createRoom };
};

export default RoomServices;
