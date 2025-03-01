import { Socket } from "socket.io";
import { rooms } from "../configs/Socket";
import { createContainer, sendContainerDetails } from "./Container.service";

const RoomOperations = (socket: Socket) => {
  //event to create a room
  socket.on("create-room", async ({ roomID, name, profile, lang }) => {
    if (rooms[roomID]) {
      socket.emit("error", "Room already exists");
    } else {
      const { containerID, stream } = await createContainer(lang, socket);
      //if container is not created then emit error
      if (!containerID || !stream) {
        socket.emit("error", "Error while creating the environment");
        return;
      }

      //add a new room
      rooms[roomID] = {
        containerID,
        streams: { terminal1: stream },
        members: {},
      };

      sendContainerDetails(socket, roomID);

      rooms[roomID].members[socket.id] = { name, profile };
      socket.join(roomID);
      socket.emit("room-created", roomID);
    }
  });

  //event to join a room
  socket.on("join-room", ({ roomID, name, profile }) => {
    if (rooms[roomID]) {
      rooms[roomID].members[socket.id] = { name, profile };
      socket.join(roomID);
      socket.emit("room-joined", {
        roomID,
      });

      sendContainerDetails(socket, roomID);
    } else {
      socket.emit("error", "Room does not exist");
    }
  });
};

export default RoomOperations;
