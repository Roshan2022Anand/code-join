import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { useMyContext } from "../utility/MyContext";
import { setRoomID } from "../redux/slices/Room";
import { toast } from "react-toastify";
import { setEditorCode, setEditorLoading } from "../redux/slices/File";

const useRoomServices = () => {
  //gloabl state from redux
  const dispatch = useDispatch();
  const { userName, profile, roomID } = useSelector(
    (state: RootState) => state.room
  );

  //socket from context
  const { socket } = useMyContext();

  //listen room events
  useEffect(() => {
    if (!socket) return;
    if (socket.hasListeners("room-created")) return;

    //listen room-created event
    socket.on("room-created", ({ roomID, code }) => {
      dispatch(setEditorCode(code));
      dispatch(setEditorLoading(false));
      dispatch(setRoomID(roomID));
    });

    //listen room-joined event
    socket.on("room-joined", (roomID) => {
      dispatch(setEditorLoading(false));
      dispatch(setRoomID(roomID));
    });

    //listen error event
    socket.on("error", (msg) => {
      dispatch(setEditorLoading(false));
      toast.error(msg);
    });

    return () => {
      socket.off("room-created");
      socket.off("room-joined");
      socket.off("container-details");
      socket.off("error");
    };
  }, [socket, dispatch]);

  //to join a room
  const joinRoom = (roomID: string) => {
    dispatch(setEditorLoading(true));
    socket?.emit("join-room", { roomID, name: userName, profile });
  };

  //to create a room
  const createRoom = (lang: string) => {
    dispatch(setEditorLoading(true));
    socket?.emit("create-room", {
      roomID,
      name: userName,
      profile,
      lang,
    });
  };

  return { joinRoom, createRoom };
};

export default useRoomServices;
