import { Socket } from "socket.io";
import { runNonInteractiveCmd } from "./Container.service";
import { rooms } from "../configs/Socket";

const RoomTestOperation = (socket: Socket) => {
  socket.on("join-test-room", ({ roomID, name, profile }) => {
    console.log("User joined test room");
    if (rooms.has(roomID)) {
      rooms
        .get(roomID)!
        .members.set(socket.id, { name, profile, currFile: null });
      socket.join(roomID);
      socket.emit("room-joined", roomID);

      runNonInteractiveCmd(socket, roomID, true);
    } else {
      socket.emit("error", "Room does not exist");
    }
  });
};

export default RoomTestOperation;
