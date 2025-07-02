import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setRoomID } from "../providers/redux/slices/room";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setFolderStructure } from "../providers/redux/slices/file";
import { RootState } from "../providers/redux/store";
import { useWsContext } from "../providers/context/config";
import { WsData, wsEvent } from "../utility/Types";

const useRoomServices = (
  setisLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const navigate = useNavigate();

  //gloabl state from redux
  const dispatch = useDispatch();
  const { userName, email } = useSelector((state: RootState) => state.room);

  //socket from context
  const { socket, listeners, WsOn, WsOff, WsEmit } = useWsContext();

  //listen room events
  useEffect(() => {
    if (!socket) return;
    if (listeners.has("room:created")) return;

    WsOn("room:created", ({ roomID }: WsData) => {
      dispatch(setRoomID(roomID));
      navigate("/home");
    });

    WsOn("room:joined", ({ roomID }: WsData) => {
      dispatch(setRoomID(roomID));
      navigate("/home");
    });

    WsOn("folder:details", ({ data }: WsData) => {
      dispatch(setFolderStructure(data));
    });

    WsOn("error", ({ msg }: WsData) => {
      setisLoading(false);
      toast.error(msg as string);
    });

    //clean up
    return () => {
      WsOff("room:created");
      WsOff("room:joined");
      WsOff("container:details");
      WsOff("error");
    };
  }, [WsOff, dispatch, navigate, setisLoading, WsOn, socket, listeners]);

  //to join a room
  const joinRoom = (roomID: string) => {
    const payload: wsEvent = {
      event: "join:room",
      data: {
        roomID,
        name: userName,
        email,
      },
    };
    WsEmit(payload);
  };

  //to create a room
  const createRoom = (lang: string) => {
    const payload: wsEvent = {
      event: "create:room",
      data: {
        name: userName,
        email,
        lang,
      },
    };
    WsEmit(payload);
  };

  return { joinRoom, createRoom };
};

export default useRoomServices;
