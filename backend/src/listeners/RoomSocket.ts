import { Socket } from "socket.io";
import { rooms } from "../configs/Socket";
const RoomOperations = (socket: Socket) => {
  socket.on("create-room", ({ roomID, name, profile, containerID }) => {
    if (rooms[roomID]) {
      socket.emit("error", "Room already exists");
    } else {
      rooms[roomID] = { containerID, members: {} };
      rooms[roomID].members[socket.id] = { name, profile };
      socket.join(roomID);
      socket.emit("room-created", roomID);
    }
  });

  socket.on("join-room", ({ roomID, name, profile }) => {
    if (rooms[roomID]) {
      rooms[roomID].members[socket.id] = { name, profile };
      socket.join(roomID);
      socket.emit("room-joined", {
        roomID,
        containerID: rooms[roomID].containerID,
      });
    } else {
      socket.emit("error", "Room does not exist");
    }
  });
};

export default RoomOperations;
