import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { useMyContext } from "../utility/MyContext";
import { setRoomID } from "../redux/slices/RoomSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setFolderStructure } from "../redux/slices/EditorSlice";

const useRoomServices = (
  setisLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const navigate = useNavigate();

  //gloabl state from redux
  const dispatch = useDispatch();
  const { userName, profile } = useSelector((state: RootState) => state.room);

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
    socket.on("room-joined", ({ roomID }) => {
      dispatch(setRoomID(roomID));
      navigate("/home");
    });

    //listen container-details event
    socket.on("folder-details", (data: string) => {
      dispatch(setFolderStructure(data));
    });

    //listen error event
    socket.on("error", (msg) => {
      setisLoading(false);
      toast.error(msg);
    });

    //clean up
    return () => {
      socket.off("room-created");
      socket.off("room-joined");
      socket.off("container-details");
      socket.off("error");
    };
  }, [socket, dispatch, navigate, setisLoading]);

  //to join a room
  const joinRoom = (roomID: string) => {
    socket?.emit("join-room", { roomID, name: userName, profile });
  };

  //to create a room
  const createRoom = (lang: string) => {
    //generate a room id using crypto
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const id = Array.from(array, (dec) => dec.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 16);

    //emit create-room event
    socket?.emit("create-room", {
      roomID: id,
      name: userName,
      profile,
      lang,
    });
  };

  return { joinRoom, createRoom };
};

export default useRoomServices;
