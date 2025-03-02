import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import RoomOperations from "../listeners/Room.service";
import { Room } from "../helpers/Types";
import TerminalOperations from "../listeners/Terminal.service";
import { StopContainer } from "../listeners/Container.service";

//global object to store rooms information
export const rooms: Room = new Map([
  [
    "123",
    {
      containerID:
        "750ffda96473fd31fa44b9e2f6a9c7a8ca8a4b37d7afe0bec6176510232e04b0",
      streams: [],
      members: new Map(),
    },
  ],
]);


//to initilize socket
let io: SocketServer;
export const initSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected");

    RoomOperations(socket);
    TerminalOperations(socket);

    //on user disconnect
    socket.on("disconnect", () => {
      rooms.forEach((room, roomID) => {
        if (room.members.has(socket.id)) {
          room.members.delete(socket.id);
          if (room.members.size === 0) {
            // test
            //   StopContainer(room.containerID);
            //   rooms.delete(roomID);
            rooms.get(roomID)!.streams = [];
          }
          console.log("User disconnected");
        }
      });
    });
  });
};

export const getIO = (): SocketServer => {
  if (!io) throw new Error("IO not initialized");
  return io;
};
