import { Socket } from "socket.io";
import { rooms } from "../configs/Socket";
import { createContainer } from "./Container.service";
import crypto from "crypto";

export const LeaveRoom = (socket: Socket, roomID: string) => {
  socket.leave(roomID);
  const room = rooms.get(roomID);
  if (room) {
    room.members.delete(socket.id);
  }
};

const RoomOperations = (socket: Socket) => {
  //event to create a room
  socket.on("create-room", async ({ roomID, name, profile, lang }) => {
    if (roomID != null) LeaveRoom(socket, roomID); //leave the room if already in a room

    roomID = crypto.randomBytes(8).toString("hex"); //random room id

    if (rooms.has(roomID)) socket.emit("error", "Room already exists");
    else {
      const { containerID, code } = await createContainer(lang, socket);
      //if container is not created then emit erFror
      if (!containerID) {
        socket.emit("error", "Error while creating the environment");
        return;
      }

      //add a new room
      rooms.set(roomID, {
        containerID,
        members: new Map(),
      });

      rooms.get(roomID)!.members.set(socket.id, { name, profile });
      socket.join(roomID);
      socket.emit("room-created", { roomID, code });
    }
  });

  //event to join a room
  socket.on("join-room", ({ roomID, name, profile }) => {
    if (rooms.has(roomID)) {
      rooms.get(roomID)!.members.set(socket.id, { name, profile });
      socket.join(roomID);
      socket.emit("room-joined", roomID);
      socket.to(roomID).emit("get-member-content", socket.id);
    } else {
      socket.emit("error", "Room does not exist");
    }
  });
};

export default RoomOperations;
